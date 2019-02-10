const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const crypto = require('crypto')

const UserSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  email: [{
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true
  }],
  password: {
    type: String,
    required: true,
    select: false
  },
  checks: [{
    type: Schema.Types.ObjectId,
    ref: 'Checks'
  }],
  tosAgreement: {
    type: Boolean,
    default: false
  },
  pro: {
    type: Boolean,
    default: false
  },
  token: {
    type: String,
    expires: '1d'
  },
}, {timestamps: true})


UserSchema.methods.encryptPassword = function(textPassword) {
  return bcrypt.hash(textPassword, 10).then(function(hash) {
    return hash;
  });
}

UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
