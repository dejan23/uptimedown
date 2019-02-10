const User = require('../models/User');
const TempUser = require('../models/TempUser');
const Checks = require('../models/Checks');
const Logs = require('../models/Logs');
const Events = require('../models/Events');
const jwt = require('jsonwebtoken');
const cryptoRandomString = require('crypto-random-string');
const verifyJWT = require('../middlewares/verify-jwt')

const nodemailer = require('nodemailer')
const sparkPostTransport = require('nodemailer-sparkpost-transport')
const transporter = nodemailer.createTransport(sparkPostTransport({
  'sparkPostApiKey': process.env.SPARKPOST_API_KEY
}))

const siteURL = process.env.SITE_URL;

// Users - POST (signup)
// Required data: username, email, password, tosAgreement
// Optional data: none
exports.signup = async (req, res, next) => {
  try {
    // Check that all required fields are filled out
    const username = typeof(req.body.username) == 'string' && req.body.username.trim().length > 0 ? req.body.username.trim() : false;
    const email = typeof(req.body.email) == 'string' && req.body.email.trim().length > 0 ? req.body.email.trim() : false;
    const password = typeof(req.body.password) == 'string' && req.body.password.trim().length > 0 ? req.body.password.trim() : false;
    const tosAgreement = true;

    // if(!tosAgreement) {
    //   return res.status(422).json({success: false, message: 'TOS are not accepted.'})
    // }

    if(username && email && password) {
      const checkTempUsername = await TempUser.findOne({ username: username })
      if(checkTempUsername) {
        return res.status(422).json({success: false, message: 'Account with that username already exists'})
      }

      const checkUsername = await User.findOne({ username: username })
      if(checkUsername) {
        return res.status(422).json({success: false, message: 'Account with that username already exists'})
      }

      const checkTempEmail = await TempUser.findOne({ email: email });
      if(checkTempEmail) {
        return res.status(422).json({success: false, message: 'Account with that email already exists'})
      }

      const checkEmail = await User.findOne({ email: email });
      if(checkEmail) {
        return res.status(422).json({success: false, message: 'Account with that email already exists'})
      }

      const token = cryptoRandomString(32);

      // if username and email does not exist in database then create new user
      let tempUser = new TempUser();
      tempUser.username = username;
      tempUser.email = email;
      tempUser.password = await tempUser.encryptPassword(password);
      tempUser.tosAgreement = tosAgreement;
      tempUser.token = token;

      tempUser.save();

      const msg = 'Hello to the Uptimedown - Uptime monitoring system, <br /> please click on this link to validate and activate your account - <a href="' + siteURL + '/accounts/validate/' + token + '">Activate account</a> <br /> Uptimedown <br /> Web: https://uptimedown.net <br /> Email: dejan.dvte@gmail.com';

      transporter.sendMail({
        from: 'Uptimedown <no-reply@mail.uptimedown.net>',
        to: email,
        subject: 'Account Verification Token - Uptimedown',
        html: msg
      }, (err, info) => {
        if (err) {
          console.error(err);
        } else {
          console.log(info);
        }
      })

      res.status(201).json({
        success: true,
        message: 'Account successfully created. Please check your inbox (or spam folder) for activation link.'
      })
    } else {
      return res.status(400).json({success: false, message: 'Missing required fields'})
    }

  } catch(err) {
    next(err)
  }
}

// Users - POST (signup)
// Required data: username, email, password, tosAgreement
// Optional data: none
exports.validateUser = async (req, res, next) => {
  try {
    // Check that all required fields are filled out
    const token = typeof(req.params.id) == 'string' && req.params.id.trim().length > 0 ? req.params.id.trim() : false;

    if(token) {
      const tempUser = await TempUser.findOne({ token: token }).select('+password')

      if(tempUser) {
        let user = new User();
        user.username = tempUser.username;
        user.email = tempUser.email;
        user.password = tempUser.password;
        user.tosAgreement = tempUser.tosAgreement;

        await user.save();
        await TempUser.findOneAndRemove({email: tempUser.email});

        return res.status(201).json({
          success: true,
          message: 'Account successfully validated and activated. Feel free to log in.'
        })
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid token...'
        })
      }
    } else {
      return res.status(400).json({success: false, message: 'Missing token'})
    }

  } catch(err) {
    next(err)
  }
}

// Users - POST (login)
// Required data: email, password
// Optional data: none
exports.login = async (req, res, next) => {
  try {
    // Check that all required fields are filled out
    const email = typeof(req.body.email) == 'string' && req.body.email.trim().length > 0 ? req.body.email.trim() : false;
    const password = typeof(req.body.password) == 'string' && req.body.password.trim().length > 0 ? req.body.password.trim() : false;

    if(email && password) {
      const user = await User.findOne({email}).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      } else {
        const isMatch = await user.comparePassword(password);
        if(isMatch) {
          let token = jwt.sign({
            user: user
          }, process.env.SECRET_JWT, {
            expiresIn: '7d'
          })

          return res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token: token,
            username: user.username,
            id: user._id,
          })
        }

        return res.status(401).send({success: false, message: 'Invalid email or password'});
      }
    } else {
      return res.status(400).json({success: false, message: 'Missing required fields'})
    }
  } catch(err) {
    next(err)
  }
}

// Users - GET
// Required data: id of the user (get it from token)
// Optional data: none
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.decoded.user._id })
      .populate('checks').select('-updatedAt')
    if(!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    if(user) {
      return res.status(201).json({
        success: true,
        message: 'Successfully found user profile',
        user: user
      })
    }
  } catch(err) {
    next(err)
  }
}

// Users - PUT
// Required data: id of the user (get it from token)
// Optional data: username, email (at least one must be specifed)
exports.updateUser = async (req, res, next) => {
  try {
    // Check that all required fields are filled out
    const username = typeof(req.body.username) == 'string' && req.body.username.trim().length > 0 ? req.body.username.trim() : false;
    const email = typeof(req.body.email) == 'string' && req.body.email.trim().length > 0 ? req.body.email.trim() : false;

    if(username || email) {
      const user = await User.findById(req.decoded.user._id)
      const checkUsernameExist = await User.findOne({'username': username})
      const checkEmailExist = await User.findOne({'email': email})

      if(checkUsernameExist && checkUsernameExist.username === username && username !== user.username) {
        return res.status(422).json({success: false, message: 'Account with that username already exists'})
      }


      if(checkEmailExist && checkEmailExist.email === email && email !== user.email) {
        return res.status(422).json({success: false, message: 'Account with that email already exists'})
      }

      if(username) user.username = req.body.username;
      if(email) user.email = req.body.email;

      user.save();
      return res.status(200).json({
        success: true,
        message: 'Successfully updated user',
        user
      })
    } else {
      return res.status(400).json({success: false, message: 'Missing required fields'})
    }
  } catch(err) {
    next(err)
  }
}

// Users - DELETE
// Required data: id of the user (get it from token)
// Optional data: none
// @TODO delete all the checks associated with the given user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.decoded.user._id);
    const checks = await Checks.find({'userId': req.decoded.user._id });
    const logs = await Logs.find({'userId': req.decoded.user._id });
    const events = await Events.find({'userId': req.decoded.user._id });

    if(!user){
      return res.status(400).json({
        success: false,
        message: 'The user was not found'
      })
    }

    if(user.username === 'demo') {
      return res.status(400).json({
        success: false,
        message: 'Not allowed to delete DEMO account.'
      })
    }

    if(user) {
      await user.remove()
    }

    if(checks) {
      await checks.map((check) => {
        check.remove()
      })
    }

    if(logs) {
      await logs.map((log) => {
        log.remove()
      })
    }

    if(events) {
      await events.map((event) => {
        event.remove()
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully deleted user'
    })
  } catch(err) {
    next(err)
  }
}

// User reset password - POST
// Required data: id of the user (get it from token), currentPassword, newPassword
// Optional data: none
exports.resetPassword = async (req, res, next) => {
  try {
    const userId = typeof(req.decoded.user._id) == 'string' && req.decoded.user._id.trim().length > 0 ? req.decoded.user._id.trim() : false;
    const currentPassword = typeof(req.body.currentPassword) == 'string' && req.body.currentPassword.trim().length > 0 ? req.body.currentPassword.trim() : false;
    const newPassword = typeof(req.body.newPassword) == 'string' && req.body.newPassword.trim().length > 0 ? req.body.newPassword.trim() : false;
    const email = typeof(req.body.email) == 'string' && req.body.email.trim().length > 0 ? req.body.email.trim() : false;

    if(userId && currentPassword && newPassword) {
      const user = await User.findById(userId).select("+password");
      if(!user) {
        return res.status(401).json({
          success: false,
          message: 'Something went wrong, user not found'
        })
      }

      if(user) {
        const isMatch = await user.comparePassword(currentPassword);
        if(!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Wrong current password.'
          })
        } else {
          const encryptedPassword = await user.encryptPassword(newPassword)
          user.password = encryptedPassword;
          user.save();
          res.status(200).json({
            success: true,
            message: 'Password successfully changed!',
            user
          })
        }
      }
    } else {
      return res.status(400).json({success: false, message: 'Missing required fields'})
    }
  } catch(err) {
    next(err)
  }
}

// User reset password - POST
// Required data: id of the user (get it from token), currentPassword, newPassword
// Optional data: none
exports.resetPasswordByEmail = async (req, res, next) => {
  try {
    const email = typeof(req.body.email) == 'string' && req.body.email.trim().length > 0 ? req.body.email.trim() : false;

    if(email) {
      const user = await User.findOne({'email': email});
      if(!user) {
        return res.status(401).json({
          success: false,
          message: 'Something went wrong, user not found'
        })
      }

      if(user) {
        userPassToken = cryptoRandomString(20);
        let newPassword = cryptoRandomString(8);
        const encryptedNewPassword = await user.encryptPassword(newPassword)
        user.token = userPassToken;
        await user.save()

        let token = jwt.sign({
          email: email,
          newPassword: encryptedNewPassword,
          token: userPassToken
        }, process.env.SECRET_JWT, {
          expiresIn: '1d'
        })

        const msg = '<h2>This is important! If you did not asked for the new password, do NOT click on the link and ignore this message!</h2> <br /> This is your new password <b>' + newPassword + '</b>, click on the link to activate new password and to login - <a href="' + siteURL + '/accounts/activate-new-password?token=' + token + '">Activate new password</a> <br /> Uptimedown <br /> Web: https://uptimedown.net <br /> Email: dejan.dvte@gmail.com';

        transporter.sendMail({
          from: 'Uptimedown <no-reply@mail.uptimedown.net>',
          to: email,
          subject: 'New password - Uptimedown',
          html: msg
        }, (err, info) => {
          if ('transporter error', err) {
            console.error(err);
          } else {
            return res.status(200).send({
              success: true,
              message: 'Email sent!'
            });
          }
        })
      }
    } else {
      return res.status(400).json({success: false, message: 'Missing required fields'})
    }
  } catch(err) {
    next(err)
  }
}

exports.activateNewPassword = async (req, res, next) => {
  try {
    const token = typeof(req.query.token) == 'string' && req.query.token.trim().length > 0 ? req.query.token.trim() : false;

    if(token) {
      jwt.verify(token, process.env.SECRET_JWT, function(err, decoded) {
        if (err) {
          return res.status(400).json({
            success: false,
            message: 'Failed to authenticate token'
          })
        }

        User.findOne({'email': decoded.email}, function(err, user) {
          if(!user.token) {
            return res.status(400).json({
              success: false,
              message: 'Password token not found, please request a new one.'
            })
          }

          if(decoded.token === user.token) {
            user.token = null;
            user.save();

            User.findOneAndUpdate({email: decoded.email}, {$set:{password: decoded.newPassword}}, {new: true}, function(err, updatedUser){
              if(err){
                return res.status(400).json({
                  success: false,
                  message: 'Something went wrong. User not found.'
                })
              }
              return res.status(200).send({
                success: true,
                message: 'New password successfully activated.'
              });
            });
          } else {
            return res.status(400).json({
              success: false,
              message: 'Password token is invalid or expired, please request a new one.'
            })
          }
        });
      })
    } else {
      return res.status(403).json({
        success: false,
        message: 'No token provided'
      })
    }
  } catch(err) {
    next(err)
  }
}

exports.resendEmail = async (req, res, next) => {
  try {
    const email = typeof(req.body.email) == 'string' && req.body.email.trim().length > 0 ? req.body.email.trim() : false;

    if(email) {
      TempUser.findOne({email: email}, function(err, existingUser) {
        if (err) {
          return next(err);
        }

        if (!existingUser) {
          return res.status(401).send({error: 'Account/email does not exist'});
        } else {

          const existingToken = existingUser.token;
          let token = cryptoRandomString(32);

          TempUser.findOneAndUpdate(
            {token: existingToken},
            {$set: {token: token}},
            {new: true},
            function(err, updatedUser) {
              if (err) {
                return next(err);
              }

              let token = updatedUser.token;
              const msg = 'Please click on this link to validate and activate your account - <a href="' + siteURL + '/accounts/validate/' + token + '">Activate account</a> <br /> Uptimedown <br /> Web: https://uptimedown.net <br /> Email: dejan.dvte@gmail.com';

              transporter.sendMail({
                from: 'Uptimedown <no-reply@mail.uptimedown.net>',
                to: email,
                subject: 'Account Verification Token - Uptimedown',
                html: msg
              }, (err, info) => {
                if ('transporter error', err) {
                  console.error(err);
                } else {
                  return res.status(200).send({
                    success: true,
                    message: 'Email sent!'
                  });
                }
              })
            }
          );
        }
      });
    } else {
      return res.status(400).json({success: false, message: 'Missing required fields'})
    }
  } catch(err) {
    next(err)
  }
};
