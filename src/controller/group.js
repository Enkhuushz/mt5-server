const { sendSuccess, sendError } = require("../utils/response");

const {
  addGroup,
  getGroup,
  getGroupByName,
} = require("../services/group/group");

const logger = require("../config/winston");
const { MT5_SERVER_TYPE } = require("../lib/constants");

const addGroupController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { name } = req.body;
    const response = await addGroup(
      name,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const getGroupController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { index, number } = req.body;
    const response = await getGroup(
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

const getGroupByNameController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { name } = req.body;
    const response = await getGroupByName(
      name,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

module.exports = {
  addGroupController,
  getGroupController,
  getGroupByNameController,
};
