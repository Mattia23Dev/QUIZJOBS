const nodemailer = require('nodemailer');

const sendHelpEmail = async (req, res) => {
  const { helpMessage, email } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'tuaemail@gmail.com',
      pass: 'tuapassword',
    },
  });

  let mailOptions = {
    from: 'tuaemail@gmail.com',
    to: 'tuaemail@gmail.com',
    subject: 'Richiesta di assistenza',
    text: `Email: ${email}\n\nMessaggio: ${helpMessage}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Errore nell\'invio dell\'email:', error);
      res.status(500).json({ message: 'Errore nell\'invio dell\'email', success: false });
    } else {
      console.log('Email inviata con successo:', info.response);
      res.status(200).json({ message: 'Email inviata con successo', success: true });
    }
  });
};

module.exports = { sendHelpEmail };
