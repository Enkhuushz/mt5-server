const { sendSuccess, sendError } = require("../utils/response");

const {
  getOpenOrderByTicket,
  getTotalOpenOrder,
  getOpenOrderByPage,
  getMultipleOpenOrder,
  getMultipleOpenOrderGroup,
  updateOpenOrder,
  deleteOpenOrder,
  moveOpenOrderToHistory,
  getClosedOrderByTicket,
  getClosedTotalOrder,
  getClosedOrderByPage,
  getClosedOrderByPageNoDate,
  getMultipleClosedOrder,
  updateClosedOrder,
  deleteClosedOrder,
} = require("../services/trading/orders/orders");

const logger = require("../config/winston");

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

//NEXT ??
const getMultipleOpenOrderController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getMultipleOpenOrder(
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

const moveOpenOrderToHistoryController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await moveOpenOrderToHistory(
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
const getClosedOrderByTicketController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getClosedOrderByTicket(
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

const getClosedTotalOrderController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getClosedTotalOrder(
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

const getClosedOrderByPageController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getClosedOrderByPage(
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
const getClosedOrderByPageNoDateController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getClosedOrderByPageNoDate(
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

const getMultipleClosedOrderController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getMultipleClosedOrder(
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

const updateClosedOrderController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await updateClosedOrder(
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

const deleteClosedOrderController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await deleteClosedOrder(
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

module.exports = {
  getOpenOrderByTicketController,
  getTotalOpenOrderController,
  getOpenOrderByPageController,
  getMultipleOpenOrderController,
  getMultipleOpenOrderGroupController,
  updateOpenOrderController,
  deleteOpenOrderController,
};
