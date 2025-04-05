// models/User.js - User model for MongoDB

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  savedDestinations: [{
    type: Schema.Types.ObjectId,
    ref: 'Destination'
  }],
  profileImage: {
    type: String,
    default: '/images/default-profile.png'
  }
});

module.exports = mongoose.model('User', UserSchema);