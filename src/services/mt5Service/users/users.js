const { authAndGetRequest, authAndPostRequest } = require("../MT5Request");
const { generate } = require("../../../utils/utils");

const getUser = async (login, type) => {
  try {
    const res = await authAndGetRequest(`/api/user/get?login=${login}`, type);
    return res;
  } catch (error) {
    logger.error(`error ${error}`);
  }
};

/**
 * Adds a new user to the MT5 server.
 * 1 Данс үүсгэх
 * @async
 * @param {string} group - The user's group.
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} phone - The user's phone number.
 * @param {string} email - The user's email address.
 * @param {number} leverage - The user's leverage.
 * @param {string} type - The user's type.
 * @returns {Promise<Object>} The response object from the server.
 */
const addUser = async (
  group,
  firstName,
  lastName,
  phone,
  email,
  leverage,
  type
) => {
  let mainPassword = generate(10);
  let investorPassword = generate(10);
  while (mainPassword === investorPassword) {
    investorPassword = generate(10);
  }

  const res = await authAndPostRequest(
    `api/user/add?group=${group}&name=${encodeURIComponent(
      `${firstName} ${lastName}`
    )}&phone=${phone}&email=${email}&leverage=${leverage}`,
    {
      PassMain: `${mainPassword}`,
      PassInvestor: `${investorPassword}`,
      Company: "Individual",
      Country: "United States",
      City: "New York",
    },
    type
  );
  // const res = await authAndGetRequest(
  //   `/api/user/add?pass_main=${password}&pass_investor=${password}&group=${group}&name=${namee}&phone=${phone}&email=${email}&leverage=${leverage}`,
  //   type
  // );
  return res;
};

// addUser(
//   "Qwer@1234$",
//   "demo\\forex-hedge-usd-01",
//   encodeURIComponent("enkhbayar enkhorkhon"),
//   "+97695059075",
//   "e.enkhbayat@gmail.com",
//   "200",
//   MT5_SERVER_TYPE.DEMO
// ).then((res) => {
//   console.log(res);
// });

/**
 * Deletes a user with the specified login.
 * 2 Данс устгах
 * @param {number} login - The login of the user to be deleted.
 * @param {string} type - The type of the user to be deleted.
 * @returns {Promise} - A Promise that resolves with the response from the server.
 */
const deleteUser = async (login, type) => {
  const res = await authAndGetRequest(`/api/user/delete?login=${login}`, type);
  return res;
};

/**
 * Retrieves multiple trade states by logins.
 * 4 Дансны мэдээлэл татах /BALANCE, EQUITY, CREDIT, LEVERAGE, USED MARGIN, FREE MARGIN/
 * @param {string} logins - The logins to retrieve trade states for.
 * @param {string} type - The type of request to make.
 * @returns {Promise} - A promise that resolves with the retrieved trade states.
 */
const getMultipleTradeStatesByLogins = async (logins, type) => {
  const res = await authAndGetRequest(
    `/api/user/account/get_batch?login=${logins}`,
    type
  );
  return res;
};

// 5 Дансны харгалзах GROUP-ийг солих
/**
 * Updates the user group for a given login.
 * @param {number} login - The user's login ID.
 * @param {string} group - The new group to assign to the user.
 * @param {string} type - The type of request to make (e.g. 'admin', 'manager', 'user').
 * @returns {Promise} - A Promise that resolves with the response from the server.
 */
const updateUserGroup = async (login, group, type) => {
  const res = await authAndGetRequest(
    `/api/user/update?login=${login}&group=${group}`,
    type
  );
  return res;
};

/**
 * Changes the password of a user with the given login.
 * 8 Дансны нууц үг солих
 * @param {number} login - The login of the user whose password will be changed.
 * @param {string} password - The new password for the user.
 * @param {string} type - The type of the user.
 * @returns {Promise} - A Promise that resolves with the response from the server.
 */
const changeUserPassword = async (login, password, type) => {
  const res = await authAndGetRequest(
    `/api/user/change_password?login=${login}&type=main&password=${password}`,
    type
  );
  return res;
};

/**
 * Updates the leverage of a user with the given login.
 * 9 Дансны харгалзах LEVERAGE-ийг солих
 * @param {number} login - The login of the user to update.
 * @param {number} leverage - The new leverage value to set for the user.
 * @param {string} type - The type of authentication to use for the request.
 * @returns {Promise<Object>} - A Promise that resolves with the response object from the API.
 */
const updateUserLeverage = async (login, leverage, type) => {
  const res = await authAndGetRequest(
    `/api/user/update?login=${login}&leverage=${leverage}`,
    type
  );
  return res;
};

/**
 * Retrieves multiple user groups from the server.
 * 12 Trading account group-д байгаа арилжааны дансны мэдээллүүдийг татах, шалгах
 * @async
 * @function getMultipleUserGroups
 * @param {string} groups - The groups to retrieve.
 * @param {string} type - The type of request to make.
 * @returns {Promise} A Promise that resolves with the response from the server.
 */
const getMultipleUserGroups = async (groups, type) => {
  const res = await authAndGetRequest(
    `/api/user/get_batch?group=${groups}`,
    type
  );
  return res;
};

const getUserByExternalAccount = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/user/get_external?account=${account}&gateway=${identifier}`,
    type
  );
  return res;
};

const getMultipleUserLogins = async (logins, type) => {
  const res = await authAndGetRequest(
    `/api/user/get_batch?login=${logins}`,
    type
  );
  return res;
};

const checkUserPassword = async (login, typee, password, type) => {
  const res = await authAndGetRequest(
    `/api/user/check_password?login=${login}&type=${typee}&password=${password}`,
    type
  );
  return res;
};

const getTradeStatus = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/user/account/get?login=${login}`,
    type
  );
  return res;
};

// 12 Дансны мэдээлэл татах /BALANCE, EQUITY, CREDIT, LEVERAGE, USED MARGIN, FREE MARGIN/
const getMultipleTradeStatesByGroups = async (groups, type) => {
  const res = await authAndGetRequest(
    `/api/user/account/get_batch?group=${groups}`,
    type
  );
  return res;
};

const getLoginList = async (groups, type) => {
  const res = await authAndGetRequest(`/api/user/logins?group=${groups}`, type);
  return res;
};

const getTotalUser = async (type) => {
  const res = await authAndGetRequest(`/api/user/total`, type);
  return res;
};

const getUserGroup = async (login, type) => {
  const res = await authAndGetRequest(`/api/user/group?login=${login}`, type);
  return res;
};

const checkBlance = async (login, flag, type) => {
  const res = await authAndGetRequest(
    `/api/user/check_balance?login=${login}&fixflag=${flag}`,
    type
  );
  return res;
};

const moveUserArchive = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/user/archive/add?login=${login}`,
    type
  );
  return res;
};

const getUserArchive = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/user/archive/get?login=${login}`,
    type
  );
  return res;
};

const getMultipleUserArchiveByLogin = async (logins, type) => {
  const res = await authAndGetRequest(
    `/api/user/archive/get_batch?login=${logins}`,
    type
  );
  return res;
};

const getMultipleUserArchiveByGroups = async (groups, type) => {
  const res = await authAndGetRequest(
    `/api/user/archive/get_batch?group=${groups}`,
    type
  );
  return res;
};

module.exports = {
  getUser,
  addUser,
  deleteUser,
  getMultipleTradeStatesByLogins,
  updateUserGroup,
  changeUserPassword,
  updateUserLeverage,
  getMultipleUserGroups,
  getUserByExternalAccount,
  getMultipleUserLogins,
  checkUserPassword,
  getTradeStatus,
  getMultipleTradeStatesByGroups,
  getLoginList,
  getTotalUser,
  getUserGroup,
  checkBlance,
  moveUserArchive,
  getUserArchive,
  getMultipleUserArchiveByLogin,
  getMultipleUserArchiveByGroups,
};
