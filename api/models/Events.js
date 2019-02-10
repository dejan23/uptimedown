const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventsSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  checkId: {
    type: String
  },
  state: {
    type: String
  },
  url: {
    type: String
  },
  responseCode: {
    type: String
  },
  duration: {
    type: String,
    default: null
  }
}, {timestamps: true})

module.exports = mongoose.model('Events', EventsSchema)
