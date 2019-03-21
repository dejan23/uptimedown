const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const TempUserSchema = new Schema({
  token: {
    type: String,
    expires: '7d'
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true
  },
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
  }
}, {timestamps: true})

TempUserSchema.methods.encryptPassword = function(textPassword) {
  return bcrypt.hash(textPassword, 10).then(function(hash) {
    return hash;
  });
}

TempUserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('TempUser', TempUserSchema)