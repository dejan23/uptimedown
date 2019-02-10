const Checks = require('../controllers/checks');
const verifyJWT = require('../middlewares/verify-jwt')

module.exports = function(app) {
  app.post('/api/checks', verifyJWT, Checks.createCheck);
  app.get('/api/checks/:id', verifyJWT, Checks.getCheckData);
  app.put('/api/checks/:id', verifyJWT, Checks.updateCheck);
  app.delete('/api/checks/:id', verifyJWT, Checks.deleteCheck);

  app.get('/api/check/:id', verifyJWT, Checks.pauseCheck);

}
