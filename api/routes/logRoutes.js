const Logs = require('../controllers/logs');
const verifyJWT = require('../middlewares/verify-jwt')

module.exports = function(app) {
  app.get('/log/:id', verifyJWT, Logs.getLogData);
  app.get('/logStats/:id', verifyJWT, Logs.getLogDataStats);
}