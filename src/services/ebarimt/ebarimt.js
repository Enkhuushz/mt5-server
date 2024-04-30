const { EBARIMT_URL, EBARIMT_MERCHANT_TIN, EBARIMT_POS_ID } = process.env;
const axios = require("axios");
const logger = require("../../config/winston");
const { Receipt } = require("../../model");
const ExcelJS = require("exceljs");

const sendReceipt = async (amountt, email) => {
  try {
    const url = `${process.env.EBARIMT_URL}/rest/receipt`;

    const amount = parseFloat(amountt);

    const body = {
      totalAmount: amount,
      districtCode: "2501",
      branchNo: "001",
      merchantTin: process.env.EBARIMT_MERCHANT_TIN,
      posId: parseInt(process.env.EBARIMT_POS_ID),
      type: "B2C_RECEIPT",
      posNo: "001",
      totalVAT: parseFloat((amount / 11).toFixed(2)),
      receipts: [
        {
          totalAmount: amount,
          taxType: "VAT_ABLE",
          customerTin: null,
          merchantTin: process.env.EBARIMT_MERCHANT_TIN,
          totalVAT: parseFloat((amount / 11).toFixed(2)),
          items: [
            {
              name: "шимтгэл эргэн төлөлт",
              barCode: "null",
              barCodeType: "UNDEFINED",
              classificationCode: "7159900",
              qty: 1,
              unitPrice: amount,
              totalAmount: amount,
              totalVAT: parseFloat((amount / 11).toFixed(2)),
            },
          ],
        },
      ],
      payments: [
        {
          code: "CASH",
          status: "PAID",
          paidAmount: amount,
        },
      ],
    };

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(url, body, headers);

    const receipt = new Receipt(response.data);
    receipt.email = email;
    await receipt.save();

    return response.data;
  } catch (err) {
    logger.error(`SENT ERROR ${err}`);
  }
};

const sendReceiptFromExcel = async (amount, vat, email) => {
  try {
    const url = `${process.env.EBARIMT_URL}/rest/receipt`;

    const parsedAmount = parseFloat(amount);
    const parsedVat = parseFloat(vat);

    const body = {
      totalAmount: parsedAmount,
      districtCode: process.env.EBARIMT_DISTRICT_CODE,
      branchNo: process.env.EBARIMT_BRANCH_NO,
      merchantTin: process.env.EBARIMT_MERCHANT_TIN,
      posId: parseInt(process.env.EBARIMT_POS_ID),
      type: process.env.EBARIMT_TYPE,
      posNo: process.env.EBARIMT_POS_NO,
      totalVAT: parsedVat,
      receipts: [
        {
          totalAmount: parsedAmount,
          taxType: process.env.EBARIMT_TAX_TYPE,
          customerTin: null,
          merchantTin: process.env.EBARIMT_MERCHANT_TIN,
          totalVAT: parsedVat,
          items: [
            {
              name: process.env.EBARIMT_NAME,
              barCode: process.env.EBARIMT_BAR_CODE,
              barCodeType: process.env.EBARIMT_BAR_CODE_TYPE,
              classificationCode: process.env.EBARIMT_CLASSIFICATION_CODE,
              qty: 1,
              unitPrice: parsedAmount,
              totalAmount: parsedAmount,
              totalVAT: parsedVat,
            },
          ],
        },
      ],
      payments: [
        {
          code: process.env.EBARIMT_CODE,
          status: process.env.EBARIMT_STATUS,
          paidAmount: parsedAmount,
        },
      ],
    };

    logger.info(`ebarimt body: ${JSON.stringify(body)}`);

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(url, body, headers);
    logger.info(`receipt : ${JSON.stringify(response.data)}`);

    const receipt = new Receipt(response.data);
    receipt.email = email;
    await receipt.save();

    return response.data;
  } catch (err) {
    logger.error(`SENT ERROR ${err}`);
  }
};

const sendReceiptFromExcelFunds = async (amount, vat, email) => {
  try {
    const url = `${process.env.EBARIMT_URL}/rest/receipt`;

    const parsedAmount = parseFloat(amount);
    const parsedVat = parseFloat(vat);

    const body = {
      totalAmount: parsedAmount,
      districtCode: process.env.EBARIMT_DISTRICT_CODE,
      branchNo: process.env.EBARIMT_BRANCH_NO,
      merchantTin: process.env.EBARIMT_MOT_FUND_MERCHANT_TIN,
      posId: parseInt(process.env.EBARIMT_POS_ID),
      type: process.env.EBARIMT_TYPE,
      posNo: process.env.EBARIMT_POS_NO,
      totalVAT: parsedVat,
      receipts: [
        {
          totalAmount: parsedAmount,
          taxType: process.env.EBARIMT_TAX_TYPE,
          customerTin: null,
          merchantTin: process.env.EBARIMT_MOT_FUND_MERCHANT_TIN,
          totalVAT: parsedVat,
          items: [
            {
              name: process.env.EBARIMT_MOT_FUND_NAME,
              barCode: process.env.EBARIMT_BAR_CODE,
              barCodeType: process.env.EBARIMT_BAR_CODE_TYPE,
              classificationCode:
                process.env.EBARIMT_MOT_FUND_CLASSIFICATION_CODE,
              qty: 1,
              unitPrice: parsedAmount,
              totalAmount: parsedAmount,
              totalVAT: parsedVat,
            },
          ],
        },
      ],
      payments: [
        {
          code: process.env.EBARIMT_CODE,
          status: process.env.EBARIMT_STATUS,
          paidAmount: parsedAmount,
        },
      ],
    };

    logger.info(`ebarimt body: ${JSON.stringify(body)}`);

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(url, body, headers);
    logger.info(`receipt : ${JSON.stringify(response.data)}`);

    const receipt = new Receipt(response.data);
    receipt.email = email;
    await receipt.save();

    return response.data;
  } catch (err) {
    logger.error(`SENT ERROR ${err}`);
  }
};

const update = async (amountt, email, id) => {
  try {
    console.log(`${amountt} ${email} ${id}`);

    const url = `${process.env.EBARIMT_URL}/rest/receipt`;

    const amount = parseFloat(amountt);

    const body = {
      totalAmount: amount,
      districtCode: "2501",
      branchNo: "001",
      merchantTin: process.env.EBARIMT_MERCHANT_TIN,
      posId: parseInt(process.env.EBARIMT_POS_ID),
      type: "B2C_RECEIPT",
      posNo: "001",
      totalVAT: parseFloat((amount / 11).toFixed(2)),
      inactiveId: id,
      receipts: [
        {
          totalAmount: amount,
          taxType: "VAT_ABLE",
          customerTin: null,
          merchantTin: process.env.EBARIMT_MERCHANT_TIN,
          totalVAT: parseFloat((amount / 11).toFixed(2)),
          items: [
            {
              name: "шимтгэл эргэн төлөлт",
              barCode: "null",
              barCodeType: "UNDEFINED",
              classificationCode: "7159900",
              qty: 1,
              unitPrice: amount,
              totalAmount: amount,
              totalVAT: parseFloat((amount / 11).toFixed(2)),
            },
          ],
        },
      ],
      payments: [
        {
          code: "CASH",
          status: "PAID",
          paidAmount: amount,
        },
      ],
    };

    console.log(body);

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(url, body, headers);

    console.log(response);

    const receipt = new Receipt(response.data);
    receipt.email = email;
    await receipt.save();

    return response.data;
  } catch (err) {
    logger.error(`SENT ERROR ${err}`);
  }
};

const sendData = async () => {
  try {
    const url = `${process.env.EBARIMT_URL}/rest/sendData`;

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(url, headers);

    return response.data;
  } catch (err) {
    logger.error(`SENT ERROR ${err}`);
  }
};

const getInfo = async () => {
  try {
    const url = `${process.env.EBARIMT_URL}/rest/info`;

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(url, headers);

    return response.data;
  } catch (err) {
    logger.error(`SENT ERROR ${err}`);
  }
};

const deleteReceipt = async (id, date) => {
  try {
    const url = `${process.env.EBARIMT_URL}/rest/receipt`;

    const body = {
      id: id,
      date: date,
    };

    console.log(url);
    console.log(body);

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.delete(url, body, headers);
    console.log(response.data);

    return response.data;
  } catch (err) {
    logger.error(`SENT ERROR ${err}`);
  }
};
const getReceiptUnique = async () => {
  try {
    const receipts = await Receipt.find();

    dataArray = [];

    for (const receipt of receipts) {
      const { id } = receipt;

      dataArray.push({
        id: id,
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Define the headers for your Excel sheet
    worksheet.columns = [{ header: "id", key: "id", width: 15 }];

    // Add the data from the extractedData array to the worksheet
    dataArray.forEach((item) => {
      worksheet.addRow(item);
    });

    // Define the file path where you want to save the Excel file
    const filePath = `file/ebarimtIds.xlsx`;

    // Save the Excel workbook to the file
    workbook.xlsx
      .writeFile(filePath)
      .then(() => {
        console.log("Excel file saved to", filePath);
      })
      .catch((error) => {
        console.error("Error saving the Excel file:", error);
      });
  } catch (error) {
    logger.error(`SENT ERROR ${error}`);
  }
};

const massDeleteReceipt = async () => {
  try {
    const url = `http://18.141.137.234:7080/rest/receipt`;

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const receipts = await Receipt.find();

    let count = 0;

    for (const receipt of receipts) {
      const { id, date, status, _id } = receipt;

      logger.info(
        `receipt id: ${id}, date: ${date}, status: ${status}, _id: ${_id}`
      );

      if (status === "SUCCESS") {
        const body = {
          id: id,
          date: date,
        };

        logger.info(`body: ${JSON.stringify(body)}`);

        await Receipt.findByIdAndUpdate(receipt._id, {
          $set: { status: "DELETED" },
        });

        console.log(`url: ${url}`);

        const response = await axios.delete(
          "http://18.141.137.234:7080/rest/receipt",
          {
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              id: id,
              date: date,
            },
          }
        );

        logger.info(`response done: ${body.id}`);

        count++;
      } else {
        logger.info(`receipt status is not SUCCESS: ${id}`);
      }
    }

    return "response";
  } catch (err) {
    logger.error(`SENT ERROR ${err}`);
  }
};

module.exports = {
  sendReceipt,
  sendReceiptFromExcel,
  sendReceiptFromExcelFunds,
  sendData,
  getInfo,
  deleteReceipt,
  update,
  massDeleteReceipt,
  getReceiptUnique,
};
