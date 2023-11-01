const { sendSuccess, sendError } = require("../utils/response");

const {
  getDealByTicket,
  getTotalDeal,
  getDealByPage,
  getDealByPageNoDate,
  getDealByPageOnlyDate,
  getMultipleDeal,
  getMultipleDealGroup,
  getMultipleDealGroupDateForSkipLogin,
  getMultipleDealGroupDateV2,
  getMultipleDealGroupDateV2Test,
  getMultipleDealGroupDate,
  updateDeal,
  deleteDeal,
} = require("../services/trading/deals/deals");

const logger = require("../config/winston");

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

//NEXT time ???
const getMultipleDealController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getMultipleDeal(
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

const getMultipleDealGroupDateForSkipLoginController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { groups, startDate, endDate } = req.body;
    const response = await getMultipleDealGroupDateForSkipLogin(
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
const getMultipleDealGroupDateV2Controller = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getMultipleDealGroupDateV2(
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
const getMultipleDealGroupDateV2TestController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getMultipleDealGroupDateV2Test(
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
//NEXT time ???
const getMultipleDealGroupDateController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getMultipleDealGroupDate(
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

module.exports = {
  getDealByTicketController,
  getTotalDealController,
  getDealByPageController,
  getDealByPageNoDateController,
  getDealByPageOnlyDateController,
  getMultipleDealController,
  getMultipleDealGroupController,
  getMultipleDealGroupDateForSkipLoginController,
  getMultipleDealGroupDateV2Controller,
  getMultipleDealGroupDateV2TestController,
  getMultipleDealGroupDateController,
  updateDealController,
  deleteDealController,
};
