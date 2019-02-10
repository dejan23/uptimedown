const User = require('../models/User');
const Checks = require('../models/Checks');
const Logs = require('../models/Logs');
const Events = require('../models/Events');
const jwt = require('jsonwebtoken');

// Checks - POST
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none
// @TODO add different max checks
// @TODO change default intervar from 1 to 3
// @TODO if no success codes provided default to 200. leave like this?
exports.createCheck = async (req, res, next) => {
  try {
    // Validate inputs
    const protocol = typeof (req.body.protocol) == 'string' && ['https', 'http'].indexOf(req.body.protocol) > -1 ? req.body.protocol : false;
    const url = typeof (req.body.url) == 'string' && req.body.url.trim().length > 0 ? req.body.url.trim() : false;
    const method = typeof (req.body.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(req.body.method) > -1 ? req.body.method : false;
    const successCodes = typeof (req.body.successCodes) == 'object' && req.body.successCodes instanceof Array && req.body.successCodes.length > 0 ? req.body.successCodes : '200';
    const timeoutSeconds = typeof (parseInt(req.body.timeoutSeconds)) == 'number' && parseInt(req.body.timeoutSeconds) % 1 === 0 && parseInt(req.body.timeoutSeconds) >= 1 && parseInt(req.body.timeoutSeconds) <= 30 ? parseInt(req.body.timeoutSeconds) : false;
    const interval = typeof (req.body.interval) == 'number' && req.body.interval % 1 === 0 && req.body.interval >= 1 && req.body.interval <= 5 ? req.body.interval : 3;

    if (protocol && url && method && successCodes && timeoutSeconds && interval) {
      const user = await User.findOne({ _id: req.decoded.user._id })
      if (!user) {
        return res.status(400).json({ success: false, message: 'The user was not found' })
      }
      const userChecks = typeof (user.checks) == 'object' && user.checks instanceof Array ? user.checks : [];
      if (userChecks.length >= 25) {
        return res.status(400).json({ success: false, message: 'The user already has the maximum number of checks (25)' })
      }

      const check = new Checks();
      check.userId = req.decoded.user._id;
      check.protocol = protocol;
      check.url = url;
      check.method = method;
      check.successCodes = successCodes;
      check.timeoutSeconds = timeoutSeconds;
      check.interval = interval;


      const event = new Events();
      event.userId = req.decoded.user._id;
      event.responseCode = 'started';
      event.state = 'started';
      event.url = url;
      event.checkId = check._id;

      // const log = new Logs();
      // log.responseTime = false;
      // log.time = Date.now();
      // log.url = url;
      // log.checkId = check._id;

      // check.logs.push(log);
      check.events.push(event);
      await check.save();
      await event.save();
      // await log.save();

      user.checks.push(check);
      await user.save();


      res.status(201).json({
        success: true,
        message: 'Check successfully created.',
        check: check
      })

    } else {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }
  } catch (err) {
    next(err)
  }
}

// Checks - GET
// Required data: id or nothing for listing all users checks
// Optional data: none
exports.getCheckData = async (req, res, next) => {
  try {
    // Check that the id is valid
    const id = typeof (req.params.id) == 'string' && req.params.id.trim().length == 24 ? req.params.id.trim() : false;

    if (id) {
      const check = await Checks.findById(id);

      if (!check) {
        return res.status(400).json({ success: false, message: 'The check was not found' })
      }

      if (check.userId === req.decoded.user._id) {
        res.status(201).json({
          success: true,
          message: 'Here is the check data with id of ' + check._id,
          check: check
        })
      } else {
        return res.status(400).json({ success: false, message: 'You are not authorized to see this' })
      }

    } else {
      const usersChecks = await User.findById(req.decoded.user._id).populate('checks');
      if (!usersChecks) {
        return res.status(400).json({ success: false, message: 'The user was not found' })
      }

      res.status(201).json({
        success: true,
        message: 'Here are all of the checks of the user: ' + req.decoded.user.username,
        checks: usersChecks.checks
      })
    }
  } catch (err) {
    next(err)
  }
}

// Checks - PUT
// Required data: id of the check (get it from params/query-string), id of the user (get it from token)
// Optional data: protocol, url, method, successCodes, timeoutSeconds, interval (at least one must be specifed)
exports.updateCheck = async (req, res, next) => {
  try {
    // Check that the id is valid
    const id = typeof (req.params.id) == 'string' && req.params.id.trim().length == 24 ? req.params.id.trim() : false;
    // Check that all required fields are filled out
    const protocol = typeof (req.body.protocol) == 'string' && ['https', 'http'].indexOf(req.body.protocol) > -1 ? req.body.protocol : false;
    const url = typeof (req.body.url) == 'string' && req.body.url.trim().length > 0 ? req.body.url.trim() : false;
    const method = typeof (req.body.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(req.body.method) > -1 ? req.body.method : false;
    const successCodes = typeof (req.body.successCodes) == 'object' && req.body.successCodes instanceof Array && req.body.successCodes.length > 0 ? req.body.successCodes : false;
    const timeoutSeconds = typeof (req.body.timeoutSeconds) == 'number' && req.body.timeoutSeconds % 1 === 0 && req.body.timeoutSeconds >= 1 && req.body.timeoutSeconds <= 5 ? req.body.timeoutSeconds : false;
    const interval = typeof (req.body.interval) == 'number' && req.body.interval % 1 === 0 && req.body.interval >= 1 && req.body.interval <= 5 ? req.body.interval : false;

    if (id && protocol || url || method || successCodes || timeoutSeconds || interval) {
      const check = await Checks.findById(id);

      if (!check) {
        return res.status(400).json({ success: false, message: 'The check was not found' })
      }

      if (check.userId === req.decoded.user._id) {
        if (req.body.protocol) check.protocol = req.body.protocol;
        if (req.body.url) check.url = req.body.url;
        if (req.body.method) check.method = req.body.method;
        if (req.body.successCodes) check.successCodes = req.body.successCodes;
        if (req.body.timeoutSeconds) check.timeoutSeconds = req.body.timeoutSeconds;
        if (req.body.interval) check.interval = req.body.interval;

        check.save();
        res.status(201).json({
          success: true,
          message: `The ${check.url} is successfully updated.`
        })
      } else {
        return res.status(400).json({ success: false, message: 'You are not authorized to see this' })
      }

    } else {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }
  } catch (err) {
    next(err)
  }
}

// Checks - DELETE
// Required data: id of the check (get it from params/query-string), id of the user (get it from token)
// Optional data: none
exports.deleteCheck = async (req, res, next) => {
  try {
    // Check that the id is valid
    const id = typeof (req.params.id) == 'string' && req.params.id.trim().length == 24 ? req.params.id.trim() : false;
    if (id) {
      // Lookup the check
      const check = await Checks.findById(id);

      if (!check) {
        return res.status(400).json({ success: false, message: 'The check was not found' })
      }

      if (check.userId === req.decoded.user._id) {
        // Delete the check data
        await check.remove();

        // Lookup the user
        const user = await User.findOne({ _id: req.decoded.user._id })
        const logs = await Logs.find({ 'checkId': check._id });
        const events = await Events.find({ 'checkId': check._id });
        // return console.log(logs)
        if (!user) {
          return res.status(400).json({ success: false, message: 'The user was not found' })
        }

        // Delete all the logs

        // Remove the deleted check from their list of checks
        user.checks.pull(check);

        await logs.map((log) => {
          log.remove()
        })

        await events.map((event) => {
          event.remove()
        })
        // Re-save the user's data
        await user.save();
        res.status(201).json({
          success: true,
          message: `The ${check.url} has been deleted.`
        })
      } else {
        return res.status(400).json({ success: false, message: 'You are not authorized to see this' })
      }

    } else {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }
  } catch (err) {
    next(err)
  }
}

// Pause check
// Required data: id of the check (get it from params/query-string), id of the user (get it from token)
// Optional data: none
exports.pauseCheck = async (req, res, next) => {
  console.log('OK')
  try {
    // Check that the id is valid
    const id = typeof (req.params.id) == 'string' && req.params.id.trim().length == 24 ? req.params.id.trim() : false;
    if (id) {
      const check = await Checks.findById(id);
      const currentEvent = await Events.findOne({ 'checkId': check._id }).sort({ 'createdAt': -1 });

      if (!check) {
        return res.status(400).json({ success: false, message: 'The check was not found' })
      }

      if (check.userId === req.decoded.user._id) {
        if (check.pause) {
          check.userId = req.decoded.user._id;
          check.pause = false;
          check.state = 'wait...';
          check.responseTime = 'wait...';
          check.responseCode = 'wait...';

          const event = new Events();
          event.userId = req.decoded.user._id;
          event.responseCode = 'restarted';
          event.state = 'restarted';
          event.url = check.url;
          event.checkId = check._id;

          await check.events.push(event);
          await event.save();

          currentEvent.duration = Date.now() - currentEvent.createdAt;
          await currentEvent.save()

          await check.save();
          return res.status(201).json({
            success: true,
            message: `The ${check.url} is successfully unpaused.`
          })
        }

        if (!check.pause) {
          check.userId = req.decoded.user._id;
          check.pause = true;
          check.state = 'paused';
          check.responseTime = 'paused';
          check.responseCode = 'paused';

          const event = new Events();
          event.userId = req.decoded.user._id;
          event.responseCode = 'paused';
          event.state = 'paused';
          event.url = check.url;
          event.checkId = check._id;

          currentEvent.duration = Date.now() - currentEvent.createdAt;
          await currentEvent.save()

          await check.events.push(event);
          await event.save();

          await check.save();
          return res.status(201).json({
            success: true,
            message: `The ${check.url} is successfully paused.`
          })
        }
      } else {
        return res.status(400).json({ success: false, message: 'You are not authorized to see this' })
      }

    } else {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }
  } catch (err) {
    next(err)
  }
}
