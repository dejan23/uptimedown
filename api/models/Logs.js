const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogsSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  checkId: {
    type: String,
    required: true
  },
  url: {
    type: String,
    trim: true
  },
  state: {
    type: String
  },
  responseTime: {
    type: Number
  },
  time: {
    type: Date
  }
}, {timestamps: true})

module.exports = mongoose.model('Logs', LogsSchema)
