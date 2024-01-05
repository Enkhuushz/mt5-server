const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const { SENDGRID_API_KEY, NOTIFICATION_EMAIL } = process.env;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (emailData) => {
  const msg = {
    from: emailData.sender,
    to: emailData.recipient,
    subject: emailData.subject,
    text: emailData.body,
    html: emailData.html,
  };
  return new Promise((resolve, reject) => {
    sgMail
      .send(msg)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  sendEmail,
};
