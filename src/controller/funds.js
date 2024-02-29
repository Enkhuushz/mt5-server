const { sendSuccess, sendError } = require("../utils/response");

const logger = require("../config/winston");
const { MT5_SERVER_TYPE } = require("../lib/constants");

const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs-extra");
const mime = require("mime-types");
const path = require("path");

const {
  addBalance,
  recoverAddBalance,
} = require("../services/fundfailed/addBalance");

const doAddBalanceFunds = async (req, res) => {
  try {
    const { envtype } = req.params;

    console.log(req.file);

    if (req.file?.filename == null || req.file?.filename == "undefined") {
      return sendError(res, "no file", 400);
    } else {
      const filePath = `uploads/${req.file.filename}`;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      fs.remove(filePath);

      const response = await addBalance(
        jsonData,
        envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
      );

      sendSuccess(res, "success", 200, response);
    }
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};
const doRecoverAddBalanceFunds = async (req, res) => {
  try {
    const { envtype } = req.params;

    console.log(req.file);

    if (req.file?.filename == null || req.file?.filename == "undefined") {
      return sendError(res, "no file", 400);
    } else {
      const filePath = `uploads/${req.file.filename}`;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      fs.remove(filePath);

      const response = await recoverAddBalance(
        jsonData,
        envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
      );

      sendSuccess(res, "success", 200, response);
    }
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

module.exports = {
  doAddBalanceFunds,
  doRecoverAddBalanceFunds,
};
