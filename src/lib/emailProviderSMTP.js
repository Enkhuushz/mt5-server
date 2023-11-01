const nodemailer = require("nodemailer");
require("dotenv").config();
const { SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = process.env;

const sendEmail = async (emailData) => {
  const mailOptions = {
    from: emailData.sender,
    to: emailData.recipient,
    subject: emailData.subject,
    text: emailData.body,
    html: emailData.html,
  };
  const transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  });
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred: ", error.message);
        reject();
      }
      console.log("Message sent: %s", info.messageId);
      resolve(info.messageId);
    });
  });
};

module.exports = {
  sendEmail,
};
