const axios = require("axios");
const logger = require("../../config/winston");
const { Receipt } = require("../../model");
const ExcelJS = require("exceljs");

const downloadHistory = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Accounts");

    sheet.columns = [
      { header: "id", key: "id" },
      { header: "amount", key: "amount" },
      { header: "vat", key: "vat" },
      { header: "date", key: "date" },
      { header: "email", key: "email" },
      { header: "created", key: "created" },
    ];

    // const totalAmountSum = await Receipt.aggregate([
    //   { $match: { status: "DELETED" } }, // Filter to include only receipts with status 'DELETED'
    //   {
    //     $group: {
    //       _id: null, // Grouping by null to aggregate all documents together
    //       count: { $sum: 1 }, // Count the total number of matching documents
    //       totalAmountSum: { $sum: "$totalAmount" }, // Sum the totalAmount for the filtered receipts
    //     },
    //   },
    // ]);
    const lists = await Receipt.find({ status: "DELETED" });

    for (const record of lists) {
      sheet.addRow({
        id: record.id,
        amount: record.totalAmount,
        vat: record.totalVAT,
        date: record.date,
        email: record.email,
        created: record.createdAt,
      });
    }

    const filePath = `file/ebarimt.xlsx`;

    workbook.xlsx
      .writeFile(filePath)
      .then(() => {
        console.log("Excel file saved to", filePath);
      })
      .catch((error) => {
        console.error("Error saving the Excel file:", error);
      });

    return "true";
  } catch (error) {}
};

module.exports = {
  downloadHistory,
};
