const Check = require('../controllers/check');
const verifyJWT = require('../middlewares/verify-jwt')

module.exports = function(app) {
  app.post('/checks', verifyJWT, Check.createCheck);
  app.get('/checks/:id', verifyJWT, Check.getCheckData);
  app.put('/checks/:id', verifyJWT, Check.updateCheck);
  app.delete('/checks/:id', verifyJWT, Check.deleteCheck);

  app.get('/check/pause/:id', verifyJWT, Check.pauseCheck);

}
