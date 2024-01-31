const emailServiceProvider = require("../lib/emailProviderSendGrid");
const emailHtmlGenerator = require("../utils/emailHtmlGenerator");
const emailHtmlFundsGenerator = require("../utils/emailHtmlFundsGenerator");

const { NOTIFICATION_EMAIL } = process.env;
const logger = require("../config/winston");

const sendEmail = async (
  amount,
  lottery,
  receiptId,
  qrData,
  date,
  recipient,
  dateFrom,
  dateTo,
  tax,
  totalAmount
) => {
  try {
    const htmlData = await emailHtmlGenerator.generate(
      amount,
      lottery,
      receiptId,
      qrData,
      date,
      dateFrom,
      dateTo,
      tax,
      totalAmount
    );

    logger.info(
      `amount: ${amount}, tax: ${tax}, totalAmount: ${totalAmount} receiptId: ${receiptId} `
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

const sendEmailFunds = async (
  amount,
  lottery,
  receiptId,
  qrData,
  login,
  recipient,
  tax,
  totalAmount
) => {
  try {
    const htmlData = await emailHtmlFundsGenerator.generateFunds(
      amount,
      lottery,
      receiptId,
      qrData,
      login,
      tax,
      totalAmount
    );

    logger.info(
      `amount: ${amount}, tax: ${tax}, totalAmount: ${totalAmount} receiptId: ${receiptId} `
    );

    const data = {
      sender: process.env.NOTIFICATION_EMAIL,
      html: htmlData,
      subject: "Худалдан авалтын баримт | MOT FUNDS ",
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
  sendEmailFunds,
};
