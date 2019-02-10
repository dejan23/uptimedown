const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChecksSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  events: [{
    type: Schema.Types.ObjectId,
    ref: 'Events'
  }],
  logs: [{
    type: Schema.Types.ObjectId,
    ref: 'Logs'
  }],
  protocol: {
    type: String,
    trim: true,
    lowercase: true,
    required: true
  },
  url: {
    type: String,
    trim: true,
    lowercase: true,
    required: true
  },
  method: {
    type: String,
    trim: true,
    lowercase: true,
    required: true
  },
  successCodes: {
    type: Array,
    default: []
  },
  interval: {
    type: Number
  },
  timeoutSeconds: {
    type: Number
  },
  state: {
    type: String,
    default: 'wait...'
  },
  lastChecked: {
    type: Date,
    default: Date.now()
  },
  responseTime: {
    type: String,
    default: 'wait...'
  },
  responseCode: {
    type: String,
    default: 'wait...'
  },
  pause: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})

module.exports = mongoose.model('Checks', ChecksSchema)
