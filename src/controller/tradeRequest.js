const {
  depositWithdraw,
} = require("../services/mt5Service/trading/tradeRequests/tradeRequests");
const logger = require("../config/winston");
const { MT5_SERVER_TYPE } = require("../lib/constants");
const { sendSuccess, sendError } = require("../utils/response");

const depositWithdrawController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login, operation, sum, comment } = req.body;
    const response = await depositWithdraw(
      login,
      operation,
      sum,
      comment,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

module.exports = {
  depositWithdrawController,
};
