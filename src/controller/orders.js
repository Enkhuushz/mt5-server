const {
  getOpenOrderByTicket,
  getTotalOpenOrder,
  getMultipleOpenOrderGroup,
  getOpenOrderByPage,
  updateOpenOrder,
  deleteOpenOrder,
} = require("../services/mt5Service/trading/orders/orders");

const logger = require("../config/winston");
const { sendSuccess, sendError } = require("../utils/response");

const { MT5_SERVER_TYPE } = require("../lib/constants");

const getOpenOrderByTicketController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { ticket } = req.body;
    const response = await getOpenOrderByTicket(
      ticket,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const getTotalOpenOrderController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login } = req.body;

    const response = await getTotalOpenOrder(
      login,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const getMultipleOpenOrderGroupController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { group } = req.body;
    const response = await getMultipleOpenOrderGroup(
      group,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const getOpenOrderByPageController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login, index, number } = req.body;
    const response = await getOpenOrderByPage(
      login,
      index,
      number,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};
const updateOpenOrderController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { order, login, priceTp } = req.body;
    const response = await updateOpenOrder(
      order,
      login,
      priceTp,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const deleteOpenOrderController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { ticket } = req.body;

    const response = await deleteOpenOrder(
      ticket,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

module.exports = {
  getOpenOrderByTicketController,
  getTotalOpenOrderController,
  getOpenOrderByPageController,
  getMultipleOpenOrderGroupController,
  updateOpenOrderController,
  deleteOpenOrderController,
};
