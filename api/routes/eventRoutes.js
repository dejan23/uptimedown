const Logs = require('../controllers/event');
const verifyJWT = require('../middlewares/verify-jwt')

module.exports = function(app) {
  app.get('/api/event/:id', verifyJWT, Logs.getEventData);
  app.get('/api/events/:id', verifyJWT, Logs.getEventsData);
}
