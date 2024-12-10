const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "skill.test.talent@gmail.com",
    pass: "thzn lqst qcvb ursw",
  },
});

module.exports = {transporter};
