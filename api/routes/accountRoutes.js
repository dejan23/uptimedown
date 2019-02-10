const Account = require('../controllers/account');
const verifyJWT = require('../middlewares/verify-jwt')

module.exports = function(app) {
  app.post('/api/accounts/signup', Account.signup)
  app.get('/api/accounts/validate/:id', Account.validateUser)
  app.post('/api/accounts/resend-email', Account.resendEmail)
  app.post('/api/accounts/login', Account.login)

  app.get('/api/accounts/user', verifyJWT, Account.getUser)
  app.put('/api/accounts/user', verifyJWT, Account.updateUser)
  app.delete('/api/accounts/user', verifyJWT, Account.deleteUser)

  app.post('/api/accounts/reset-password', verifyJWT, Account.resetPassword)
  app.post('/api/accounts/reset-password-by-email', Account.resetPasswordByEmail)
  app.get('/api/accounts/activate-new-password', Account.activateNewPassword)

}
