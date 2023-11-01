const {
  addUser,
  updateUserGroup,
  updateUserLeverage,
  deleteUser,
  getUser,
  getUserByExternalAccount,
  getMultipleUserGroups,
  getMultipleUserLogins,
  checkUserPassword,
  changeUserPassword,
  getTradeStatus,
  getMultipleTradeStatesByLogins,
  getMultipleTradeStatesByGroups,
  getLoginList,
  getTotalUser,
  getUserGroup,
  checkBlance,
  moveUserArchive,
  getUserArchive,
  getMultipleUserArchiveByLogin,
  getMultipleUserArchiveByGroups,
} = require("../services/users/users");
const logger = require("../config/winston");
const { MT5_SERVER_TYPE } = require("../lib/constants");

const addUserController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { password, group, namee, phone, email, leverage } = req.body;
    const response = await addUser(
      password,
      group,
      namee,
      phone,
      email,
      leverage,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const updateUserGroupController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login, group } = req.body;
    const response = await updateUserGroup(
      login,
      group,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const updateUserLeverageController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login, leverage } = req.body;
    const response = await updateUserLeverage(
      login,
      leverage,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login } = req.body;

    const response = await deleteUser(
      login,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};
const getUserController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getUser(
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
const getUserByExternalAccountController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getUserByExternalAccount(
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

const getMultipleUserGroupsController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getMultipleUserGroups(
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

const getMultipleUserLoginsController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getMultipleUserLogins(
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
const checkUserPasswordController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login, typee, password } = req.body;
    const response = await checkUserPassword(
      login,
      typee,
      password,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};
const changeUserPasswordController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login, password } = req.body;

    const response = await changeUserPassword(
      login,
      password,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};
const getTradeStatusController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getTradeStatus(
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

const getMultipleTradeStatesByLoginsController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login } = req.body;
    const response = await getMultipleTradeStatesByLogins(
      login,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

const getMultipleTradeStatesByGroupsController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { group } = req.body;
    const response = await getMultipleTradeStatesByGroups(
      group,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};
const getLoginListController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getLoginList(
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

const getTotalUserController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getTotalUser(
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

const getUserGroupController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getUserGroup(
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
const checkBlanceController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await checkBlance(
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

const moveUserArchiveController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await moveUserArchive(
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

const getUserArchiveController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getUserArchive(
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
const getMultipleUserArchiveByLoginController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getMultipleUserArchiveByLogin(
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

const getMultipleUserArchiveByGroupsController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const response = await getMultipleUserArchiveByGroups(
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
  addUserController,
  updateUserGroupController,
  updateUserLeverageController,
  deleteUserController,
  getUserController,
  getUserByExternalAccountController,
  getMultipleUserGroupsController,
  getMultipleUserLoginsController,
  checkUserPasswordController,
  changeUserPasswordController,
  getTradeStatusController,
  getMultipleTradeStatesByLoginsController,
  getMultipleTradeStatesByGroupsController,
  getLoginListController,
  getTotalUserController,
  getUserGroupController,
  checkBlanceController,
  moveUserArchiveController,
  getUserArchiveController,
  getMultipleUserArchiveByLoginController,
  getMultipleUserArchiveByGroupsController,
};
