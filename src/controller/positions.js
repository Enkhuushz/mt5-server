const {
  getPositionBySymbol,
  getTotalPosition,
  getPositionByPage,
  getMultiplePosition,
  getMultiplePositionGroup,
  updatePosition,
  deletePosition,
  checkPosition,
  fixPosition,
} = require("../services/trading/positions/positions");
const logger = require("../config/winston");

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

const getMultiplePositionController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getMultiplePosition(
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

const checkPositionController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login } = req.body;
    const response = await checkPosition(
      login,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const fixPositionController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await fixPosition(
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
  getPositionBySymbolController,
  getTotalPositionController,
  getPositionByPageController,
  getMultiplePositionController,
  getMultiplePositionGroupController,
  updatePositionController,
  deletePositionController,
  checkPositionController,
  fixPositionController,
};
