const xlsx = require("xlsx");
const fs = require("fs");
const { sendReceiptFromExcel } = require("./ebarimt");
const { sendEmail } = require("../emailService");
const logger = require("../../config/winston");

const send = async (fromDate, toDate) => {
  try {
    const list = await read();

    for (data of list) {
      console.log(data);

      // const receipt = await sendReceiptFromExcel(
      //   data.amount,
      //   data.vat,
      //   data.email
      // );

      await sendEmail(
        data.amount,
        "receipt.lottery",
        "receipt.id",
        "receipt.qrData",
        "receipt.date",
        data.login,
        data.email,
        fromDate.replace(/-/g, "/"),
        toDate.replace(/-/g, "/"),
        data.vat,
        data.revenue
      );
    }

    console.log(list);
  } catch (error) {}
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
  } catch (error) {}
};

module.exports = {
  send,
};
