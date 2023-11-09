const { sendSuccess, sendError } = require("../utils/response");

const {
  getTotalDeal,
  getDealByPage,
  getDealByPageOnlyDate,
  getDealByPageNoDate,
  getMultipleDealGroup,
  updateDeal,
  deleteDeal,
  getDealByTicket,
} = require("../services/mt5Service/trading/deals/deals");

const logger = require("../config/winston");
const { MT5_SERVER_TYPE } = require("../lib/constants");

const getTotalDealController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login, startDate, endDate } = req.body;
    const response = await getTotalDeal(
      login,
      startDate,
      endDate,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};
const getDealByPageController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login, startDate, endDate, index, number } = req.body;
    const response = await getDealByPage(
      login,
      startDate,
      endDate,
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

const getDealByPageOnlyDateController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login, startDate, endDate } = req.body;
    const response = await getDealByPageOnlyDate(
      login,
      startDate,
      endDate,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const getDealByPageNoDateController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login, index, number } = req.body;
    const response = await getDealByPageNoDate(
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

const getMultipleDealGroupController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { groups, startDate, endDate } = req.body;

    const response = await getMultipleDealGroup(
      groups,
      startDate,
      endDate,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const updateDealController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { deal, externalId, login, priceTp } = req.body;
    const response = await updateDeal(
      deal,
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
const deleteDealController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { ticket } = req.body;
    const response = await deleteDeal(
      ticket,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const getDealByTicketController = async (req, res) => {
  try {
    const { envtype, ticket } = req.params;
    const response = await getDealByTicket(
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
  getDealByTicketController,
  getTotalDealController,
  getDealByPageController,
  getDealByPageNoDateController,
  getDealByPageOnlyDateController,
  getMultipleDealGroupController,
  updateDealController,
  deleteDealController,
};
