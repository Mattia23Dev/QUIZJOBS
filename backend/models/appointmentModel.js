const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
},
  candidate: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "candidates",
    required: true,
},
  date: { 
    type: Date, 
    required: true
},
  description: { 
    type: String
},
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;