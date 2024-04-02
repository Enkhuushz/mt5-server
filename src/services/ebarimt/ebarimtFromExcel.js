const xlsx = require("xlsx");
const fs = require("fs");
const {
  sendReceiptFromExcel,
  sendReceiptFromExcelFunds,
} = require("./ebarimt");
const { sendEmail, sendEmailFunds } = require("../emailService");
const logger = require("../../config/winston");

const send = async (fromDate, toDate) => {
  try {
    const list = await read();

    let count = 0;

    for (data of list) {
      console.log(data);

      // if (count == 1) {
      //   break;
      // }

      const receipt = await sendReceiptFromExcel(
        data.amount,
        data.vat,
        data.email
      );

      await sendEmail(
        data.amount,
        receipt.lottery,
        receipt.id,
        receipt.qrData,
        receipt.date,
        data.email,
        fromDate.replace(/-/g, "/"),
        toDate.replace(/-/g, "/"),
        data.vat,
        data.revenue
      );

      count++;
    }
  } catch (error) {
    logger.error(`send ebarimt from excel ERROR ${error}`);
  }
};

const sendFunds = async () => {
  try {
    const list = await read();

    let count = 0;

    for (data of list) {
      console.log(data);

      const receipt = await sendReceiptFromExcelFunds(
        data.amount,
        data.vat,
        data.email
      );

      await sendEmailFunds(
        data.amount,
        receipt.lottery,
        receipt.id,
        receipt.qrData,
        data.login,
        data.email,
        data.vat,
        data.revenue
      );

      count++;
    }
  } catch (error) {
    logger.error(`send ebarimt from excel ERROR ${error}`);
  }
};

const read = async () => {
  try {
    const filePath = `file/ccc.xlsx`;

    if (fs.existsSync(filePath)) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      logger.info(`data from excel${JSON.stringify(jsonData)}`);
      return jsonData;
    }
    return "false";
  } catch (error) {
    logger.error(`read excel ERROR ${error}`);
  }
};

module.exports = {
  send,
  sendFunds,
};
