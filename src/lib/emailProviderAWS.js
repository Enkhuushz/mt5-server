const aws = require('aws-sdk');
const logger = require('../config/winston');

require('dotenv').config();


const {
    AWS_SES_REGION,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,

    NOTIFICATION_EMAIL_SENDER,

} = process.env;

/**
 * 
 * @param {object} emailObject - { sender, recipient, subject, bodyText }
 */
function sendEmail(emailObject) {
  let sender = `${NOTIFICATION_EMAIL_SENDER}`;
  if (emailObject.sender) {
    sender = emailObject.sender;
  }
  const { recipient } = emailObject;
  const ses = new aws.SES({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_SES_REGION,
  });
  const params = {
    Source: sender,
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Subject: {
        Data: emailObject.subject,
        Charset: 'UTF-8',
      },
      Body: {
        Text: {
          Data: emailObject.bodyText,
          Charset: 'UTF-8',
        },
        // Html: {
        //   Data: emailObject.bodyHtml,
        //   Charset: 'UTF-8',
        // },
      },
    },
  };

  ses.sendEmail(params, (err, data) => {
    if (err) {
      throw err;
    } else {
        logger.info(`Email sent! Message ID: ${data.MessageId}`);
    }
  });
}



module.exports = {
    sendEmail,
}