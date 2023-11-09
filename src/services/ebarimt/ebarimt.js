const { EBARIMT_URL, EBARIMT_MERCHANT_TIN, EBARIMT_POS_ID } = process.env;
const axios = require("axios");
const logger = require("../../config/winston");
const { Receipt } = require("../../model");

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
      totalVAT: amount / 11,
      receipts: [
        {
          totalAmount: amount,
          taxType: "VAT_ABLE",
          merchantTin: process.env.EBARIMT_MERCHANT_TIN,
          totalVAT: amount / 11,
          items: [
            {
              name: "шимтгэл эргэн төлөлт",
              barCode: "null",
              barCodeType: "UNDEFINED",
              classificationCode: "7159",
              qty: 1,
              unitPrice: amount,
              totalAmount: amount,
              totalVAT: amount / 11,
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

    return receipt;
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

module.exports = {
  sendReceipt,
  sendData,
  getInfo,
  deleteReceipt,
};
