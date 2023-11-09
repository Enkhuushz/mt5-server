const express = require("express");
let router = express.Router();
const { sendSuccess, sendError } = require("../utils/response");
const {
  sendReceipt,
  sendData,
  getInfo,
  deleteReceipt,
} = require("../services/ebarimt/ebarimt");
const {
  getMultipleDealGroupDateForSkipLogin,
  getMultipleDealGroupDateV2,
  getMultipleDealGroupDateV2Test,
} = require("../services/ebarimt/ebarimtSend");

const { getCurrencyRate } = require("../services/currencyRate");

const logger = require("../config/winston");
const { Receipt, SkipLogin } = require("../model");
const { MT5_SERVER_TYPE } = require("../lib/constants");

router.get("/sendReceipt/:amount", async (req, res) => {
  try {
    const { amount } = req.params;

    console.log(amount);

    const response = await sendReceipt(amount, "enkhbayar.e@gmail.com");
    console.log(response);

    return sendSuccess(res, "success", 200, "true");
  } catch (error) {
    logger.error(`/GET /ebarimt ERROR: ${error.message}`);
    return sendError(res, error.message, 500);
  }
});

router.get("/sendData", async (req, res) => {
  try {
    const response = await sendData();
    console.log(response);

    return sendSuccess(res, "success", 200, "true");
  } catch (error) {
    logger.error(`/GET /ebarimt ERROR: ${error.message}`);
    return sendError(res, error.message, 500);
  }
});

router.get("/getInfo", async (req, res) => {
  try {
    const response = await getInfo();
    console.log(response);

    return sendSuccess(res, "success", 200, "true");
  } catch (error) {
    logger.error(`/GET /ebarimt ERROR: ${error.message}`);
    return sendError(res, error.message, 500);
  }
});

// getMultipleDealGroupDateForSkipLogin(
//   "real\\pro",
//   "2023-10-26 00:00:00",
//   "2023-10-26 23:59:59",
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   console.log(res);
// });

// router.get("/deals", async (req, res) => {
//   try {
//     const response = await getMultipleDealGroupDateForSkipLogin(
//       "real\\pro",
//       "2023-09-29 00:00:00",
//       "2023-09-29 23:59:59",
//       MT5_SERVER_TYPE.LIVE
//     );
//     console.log("response");

//     return sendSuccess(res, "success", 200, "true");
//   } catch (error) {
//     logger.error(`/GET /ebarimt ERROR: ${error.message}`);
//     return sendError(res, error.message, 500);
//   }
// });

router.get("/skipLogin/:login", async (req, res) => {
  try {
    const { login } = req.params;

    const foundSkipLogin = await SkipLogin.findOne({ login: login });

    return sendSuccess(res, "success", 200, foundSkipLogin);
  } catch (error) {
    logger.error(`/GET /ebarimt ERROR: ${error.message}`);
    return sendError(res, error.message, 500);
  }
});

router.get("/deals/v2", async (req, res) => {
  try {
    const response = await getMultipleDealGroupDateV2(
      "real\\pro",
      "2023-10-24 00:00:00",
      "2023-10-24 23:59:59",
      MT5_SERVER_TYPE.LIVE
    );
    console.log("response");

    return sendSuccess(res, "success", 200, "true");
  } catch (error) {
    logger.error(`/GET /ebarimt ERROR: ${error.message}`);
    return sendError(res, error.message, 500);
  }
});

router.get("/deals/v2/test", async (req, res) => {
  try {
    const response = await getMultipleDealGroupDateV2Test(
      "real\\pro",
      "511636",
      "2023-10-01 00:00:00",
      "2023-10-31 23:59:59",
      MT5_SERVER_TYPE.LIVE
    );
    console.log("response");

    return sendSuccess(res, "success", 200, "true");
  } catch (error) {
    logger.error(`/GET /ebarimt ERROR: ${error.message}`);
    return sendError(res, error.message, 500);
  }
});

router.get("/currency-rate", async (req, res) => {
  try {
    const response = await getCurrencyRate();

    return sendSuccess(res, "success", 200, "true");
  } catch (error) {
    logger.error(`/GET /ebarimt ERROR: ${error.message}`);
    return sendError(res, error.message, 500);
  }
});

// router.get("/deleteReceipt/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const foundReceipt = await Receipt.findOne({ id: id });

//     if (foundReceipt) {
//       const response = await deleteReceipt(id, foundReceipt.date);
//       console.log(response);
//     } else {
//       return sendError(res, `Receipt not found`, 404);
//     }
//     return sendSuccess(res, "success", 200, "true");
//   } catch (error) {
//     logger.error(`/GET /ebarimt ERROR: ${error.message}`);
//     return sendError(res, error.message, 500);
//   }
// });
module.exports = router;
