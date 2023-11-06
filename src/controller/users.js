const {
  getUser,
  addUser,
  deleteUser,
  getMultipleTradeStatesByLogins,
  updateUserLeverage,
  changeUserPassword,
  updateUserGroup,
  getMultipleUserGroups,
} = require("../services/users/users");
const logger = require("../config/winston");
const { MT5_SERVER_TYPE } = require("../lib/constants");
const { sendSuccess, sendError } = require("../utils/response");

// 0)
const getUserController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { login } = req.body;
    const response = await getUser(
      login,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

// 1)
const addUserController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { group, firstName, lastName, phone, email, leverage } = req.body;
    const response = await addUser(
      group,
      firstName,
      lastName,
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

// 2)
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

// 4)
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

// 5) User CHange Group
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

// 8) Change Password
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

// 9) User Change Leverage
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

// 12 Trading account group-д байгаа арилжааны дансны мэдээллүүдийг татах, шалгах
const getMultipleUserGroupsController = async (req, res) => {
  try {
    const { envtype } = req.params;
    const { group } = req.body;

    const response = await getMultipleUserGroups(
      group,
      envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
    );
    sendSuccess(res, "success", 200, response);
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

// const getUserByExternalAccountController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const response = await getUserByExternalAccount(
//       0,
//       20,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };

// const getMultipleUserLoginsController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const response = await getMultipleUserLogins(
//       0,
//       20,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };
// const checkUserPasswordController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const { login, typee, password } = req.body;
//     const response = await checkUserPassword(
//       login,
//       typee,
//       password,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };

// const getTradeStatusController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const response = await getTradeStatus(
//       0,
//       20,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };

// const getMultipleTradeStatesByGroupsController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const { group } = req.body;
//     const response = await getMultipleTradeStatesByGroups(
//       group,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };
// const getLoginListController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const response = await getLoginList(
//       0,
//       20,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };

// const getTotalUserController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const response = await getTotalUser(
//       0,
//       20,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };

// const getUserGroupController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const response = await getUserGroup(
//       0,
//       20,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };
// const checkBlanceController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const response = await checkBlance(
//       0,
//       20,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };

// const moveUserArchiveController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const response = await moveUserArchive(
//       0,
//       20,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };

// const getUserArchiveController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const response = await getUserArchive(
//       0,
//       20,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };
// const getMultipleUserArchiveByLoginController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const response = await getMultipleUserArchiveByLogin(
//       0,
//       20,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };

// const getMultipleUserArchiveByGroupsController = async (req, res) => {
//   try {
//     const { envtype } = req.params;
//     const response = await getMultipleUserArchiveByGroups(
//       0,
//       20,
//       envtype == "live" ? MT5_SERVER_TYPE.LIVE : MT5_SERVER_TYPE.DEMO
//     );
//     sendSuccess(res, "success", 200, response);
//   } catch (error) {
//     logger.error(`error ${error}`);
//     sendError(res, error.message, 500);
//   }
// };

module.exports = {
  getUserController,
  addUserController,
  deleteUserController,
  getMultipleTradeStatesByLoginsController,
  updateUserGroupController,
  changeUserPasswordController,
  updateUserLeverageController,
  getMultipleUserGroupsController,
};
