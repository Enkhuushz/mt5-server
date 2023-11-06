const {
  getMultiplePositionGroup,
  getPositionBySymbol,
  getTotalPosition,
  getPositionByPage,
  updatePosition,
  deletePosition,
} = require("../services/trading/positions/positions");
const logger = require("../config/winston");
const { sendSuccess, sendError } = require("../utils/response");
const { MT5_SERVER_TYPE } = require("../lib/constants");

const getMultiplePositionGroupController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { group } = req.body;
    const response = await getMultiplePositionGroup(
      group,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const getPositionBySymbolController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login, symbol } = req.body;

    const response = await getPositionBySymbol(
      login,
      symbol,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const getTotalPositionController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login } = req.body;
    const response = await getTotalPosition(
      login,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const getPositionByPageController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login, index, number } = req.body;
    const response = await getPositionByPage(
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

const updatePositionController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { position, externalId, login, priceTp } = req.body;
    const response = await updatePosition(
      position,
      externalId,
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

const deletePositionController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { ticket } = req.body;
    const response = await deletePosition(
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
  getMultiplePositionGroupController,
  getPositionBySymbolController,
  getTotalPositionController,
  getPositionByPageController,
  updatePositionController,
  deletePositionController,
};
