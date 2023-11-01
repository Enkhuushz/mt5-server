const emailServiceProvider = require("../lib/emailProviderSMTP");
const emailHtmlGenerator = require("../utils/emailHtmlGenerator");
const { NOTIFICATION_EMAIL } = process.env;
const logger = require("../config/winston");

/**
 *
 * @param {*} emailData - { sender, recipient, subject, body, html }
 */
const sendEmail = async (
  amount,
  lottery,
  receiptId,
  qrData,
  date,
  login,
  recipient,
  dateFrom,
  dateTo
) => {
  try {
    const htmlData = await emailHtmlGenerator.generate(
      amount,
      lottery,
      receiptId,
      qrData,
      date,
      login,
      dateFrom,
      dateTo
    );

    const data = {
      sender: NOTIFICATION_EMAIL,
      html: htmlData,
      subject: "Арилжааны шимтгэл буцаан олголт | MOTForex",
      recipient: recipient,
      body: "info",
    };

    const res = await emailServiceProvider.sendEmail(data);

    logger.info(`EMAIL SENT from: ${NOTIFICATION_EMAIL}, to: ${recipient}`);
  } catch (err) {
    logger.error(`SENT ERROR ${err}`);
  }
};

module.exports = {
  sendEmail,
};
