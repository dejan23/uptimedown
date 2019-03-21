const Events = require('../controllers/events');
const verifyJWT = require('../middlewares/verify-jwt')

module.exports = function(app) {
  app.get('/event/:id', verifyJWT, Events.getEventData);
  app.get('/events/:id', verifyJWT, Events.getEventsData);
}