const Appointment = require("../models/appointmentModel");
const candidateModel = require("../models/candidateModel");


const saveAppointment = async (req, res) => {
    try {
      const { title, candidate, date, time, description, id } = req.body;
      const dateTime = new Date(`${date}T${time}`);
      const candidateDetails = await candidateModel.findById(candidate);

      const appointment = new Appointment({
        title,
        candidate,
        date: dateTime,
        description,
        company: id,
      });
  
      const savedAppointment = await appointment.save();
      savedAppointment.candidate = candidateDetails;
      res.status(201).json({data: savedAppointment, success: true, message: 'Appuntamento aggiunto'});
    } catch (error) {
      console.error('Errore durante il salvataggio dell\'appuntamento:', error);
      res.status(500).json({ message: 'Si è verificato un errore durante il salvataggio dell\'appuntamento' });
    }
  };

  const getAppointmentUser = async (req, res) => {
        try {
          const companyId = req.params.companyId;
      
          const appointments = await Appointment.find({ company: companyId }).populate('candidate');
      
          res.status(200).json({success: true, data: appointments, message: 'esami presi'});
        } catch (error) {
          console.error('Errore durante il recupero degli appuntamenti:', error);
          res.status(500).json({ message: 'Si è verificato un errore durante il recupero degli appuntamenti.' });
        }
  }

  const deleteAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appuntamento non trovato' });
        }

        await Appointment.findByIdAndDelete(appointmentId);

        res.status(200).json({ success: true, message: 'Appuntamento eliminato con successo' });
    } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'appuntamento:', error);
        res.status(500).json({ message: 'Si è verificato un errore durante l\'eliminazione dell\'appuntamento' });
    }
};

const updateAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const { title, candidate, date, time, description } = req.body;
        const dateTime = new Date(`${date}T${time}`);

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appuntamento non trovato' });
        }

        appointment.title = title;
        appointment.candidate = candidate;
        appointment.date = dateTime;
        appointment.description = description;

        await appointment.save();

        res.status(200).json({ success: true, message: 'Appuntamento aggiornato con successo' });
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'appuntamento:', error);
        res.status(500).json({ message: 'Si è verificato un errore durante l\'aggiornamento dell\'appuntamento' });
    }
};

module.exports = {saveAppointment, getAppointmentUser, deleteAppointment, updateAppointment};
