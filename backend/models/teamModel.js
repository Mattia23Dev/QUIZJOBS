const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { 
    type: String,
    required: true
  },
  role: {
    type: String,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  teamType: {
    type: Boolean,
    default: true,
  }
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;