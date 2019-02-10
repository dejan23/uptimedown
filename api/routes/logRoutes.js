const Logs = require('../controllers/logs');
const verifyJWT = require('../middlewares/verify-jwt')

module.exports = function(app) {
  app.get('/api/log/:id', verifyJWT, Logs.getLogData);
  app.get('/api/logStats/:id', verifyJWT, Logs.getLogDataStats);
}
