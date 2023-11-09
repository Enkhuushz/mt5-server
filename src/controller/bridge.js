const { sendSuccess, sendError } = require("../utils/response");
const logger = require("../config/winston");
const { get } = require("../services/bridge/deal");

const getController = async (req, res) => {
  try {
    const response = await get();
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

module.exports = {
  getController,
};
