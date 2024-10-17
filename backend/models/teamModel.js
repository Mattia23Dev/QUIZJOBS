const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
  },
  fName: {
    type: String,
    trim: true,
  },
  lName: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  surname: {
    type: String,
    trim: true,
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
    required: true,
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
  },
  refreshGoogleToken: String,
  accessGoogleToken: String,
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
