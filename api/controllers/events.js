const Events = require('../models/Events');
const async = require('async');


// Event - GET
// Required data: id
// Optional data: none
exports.getEventData = async (req, res, next) => {
  try {
    // Check that the id is valid
    const id = typeof(req.params.id) == 'string' && req.params.id.trim().length == 24 ? req.params.id.trim() : false;

    if(id) {
      const event = await Events.findOne({'checkId': req.params.id}).sort({'createdAt': -1});

      if(!event || event.length === 0) {
        return res.status(400).json({success: false, message: 'The event was not found'})
      }
      
      res.status(200).json({
        success: true,
        message: 'Here is the event log',
        eventTime: event.createdAt,
        eventState: event.state
      })
    } else {
      return res.status(400).json({success: false, message: 'Missing required fields'})

    }
  } catch(err){
    next(err)
  }
}

exports.getEventsData = async (req, res, next) => {
  try {
    // Check that the id is valid
    const id = typeof(req.params.id) == 'string' && req.params.id.trim().length == 24 ? req.params.id.trim() : false;
    const page = typeof(parseInt(req.query.page)) == 'number' && parseInt(req.query.page) % 1 === 0 ? parseInt(req.query.page) : 0;

    if(id) {
      // const events = await Events.find({'checkId': req.params.id}).sort({'createdAt': 1});
      //
      // if(!events || events.length === 0) {
      //   return res.status(400).json({success: false, message: 'The event was not found'})
      // }

      const perPage = 20;
      async.parallel([
        function(callback) {
          Events.count({'checkId': req.params.id}, (err, count) => {
            let totalEvents = count;
            callback(err, totalEvents)
          })
        },
        function(callback) {
          Events.find({'checkId': req.params.id}).sort({'createdAt': -1})
            .skip(perPage * page)
            .limit(perPage)
            .exec((err, events) => {
              if(err) return next(err)
              callback(err, events)
            })
        }
      ], function(err, results) {
        let totalEvents = results[0];
        let events = results[1];

        res.json({
          success: true,
          message: 'Here are the events',
          events: events,
          totalEvents: totalEvents,
          pages: Math.ceil(totalEvents / perPage)
        })
      })

      // res.status(200).json({
      //   success: true,
      //   message: 'Here is the events log',
      //   events: events
      // })
    } else {
      return res.status(400).json({success: false, message: 'Missing required fields'})

    }
  } catch(err){
    next(err)
  }
}