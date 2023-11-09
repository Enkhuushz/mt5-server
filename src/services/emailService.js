const emailServiceProvider = require("../lib/emailProviderSMTP");
const emailHtmlGenerator = require("../utils/emailHtmlGenerator");
const { NOTIFICATION_EMAIL } = process.env;
const logger = require("../config/winston");

/**
 * Sends an email with the given parameters.
 * @async
 * @param {number} amount - The amount of the transaction.
 * @param {string} lottery - The name of the lottery.
 * @param {string} receiptId - The ID of the receipt.
 * @param {string} qrData - The QR code data.
 * @param {Date} date - The date of the transaction.
 * @param {string} login - The user's login.
 * @param {string} recipient - The recipient's email address.
 * @param {Date} dateFrom - The start date of the transaction.
 * @param {Date} dateTo - The end date of the transaction.
 * @returns {Promise<void>} - A Promise that resolves when the email is sent.
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
  dateTo,
  type,
  tax
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
      dateTo,
      type,
      tax
    );

    const data = {
      sender: process.env.NOTIFICATION_EMAIL,
      html: htmlData,
      subject: "Арилжааны шимтгэл буцаан олголт | MOTForex",
      recipient: recipient,
      body: "info",
    };

    await emailServiceProvider.sendEmail(data);

    logger.info(`EMAIL SENT from: ${NOTIFICATION_EMAIL}, to: ${recipient}`);
  } catch (err) {
    logger.error(`SENT ERROR ${err}`);
  }
};

module.exports = {
  sendEmail,
};
