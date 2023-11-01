const {
  depositWithdraw,
  checkMargin,
  calculateProfitForPosition,
  sendRequest,
  getRequestResult,
} = require("../services/trading/tradeRequests/tradeRequests");
const logger = require("../config/winston");

const depositWithdrawController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await depositWithdraw(
      0,
      20,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const checkMarginController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await checkMargin(
      0,
      20,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};
const calculateProfitForPositionController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await calculateProfitForPosition(
      0,
      20,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};
const sendRequestController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await sendRequest(
      0,
      20,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
  }
};
const getRequestResultController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getRequestResult(
      0,
      20,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
  }
};

module.exports = {
  depositWithdrawController,
  checkMarginController,
  calculateProfitForPositionController,
  sendRequestController,
  getRequestResultController,
};
