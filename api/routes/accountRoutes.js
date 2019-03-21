const Account = require('../controllers/account');
const verifyJWT = require('../middlewares/verify-jwt')

module.exports = function (app) {
    // registration part
    app.post('/accounts/signup', Account.signup)
    app.get('/accounts/validate/:id', Account.validateUser)
    app.post('/accounts/resend-email', Account.resendEmail)

    // login part
    app.post('/accounts/login', Account.login)

    // user part
    app.get('/accounts/user', verifyJWT, Account.getUser)
    app.put('/accounts/user', verifyJWT, Account.updateUser)
    app.delete('/accounts/user', verifyJWT, Account.deleteUser)

    // reseting the password part
    app.post('/accounts/reset-password', verifyJWT, Account.resetPassword)
    app.post('/accounts/reset-password-by-email', Account.resetPasswordByEmail)
    app.get('/accounts/activate-new-password', Account.activateNewPassword)

}