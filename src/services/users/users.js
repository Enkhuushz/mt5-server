const {
  authAndGetRequest,
  authAndPostRequest,
} = require("../mt5Service/MT5Request");
const { MT5_SERVER_TYPE } = require("../../lib/constants");
const logger = require("../../config/winston");
const { generate } = require("../../utils/utils");

const getUser = async (login, type) => {
  const res = await authAndGetRequest(`/api/user/get?login=${login}`, type);
  return res;
};

// 1 Данс үүсгэх
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

// 2 Данс устгах
const deleteUser = async (login, type) => {
  const res = await authAndGetRequest(`/api/user/delete?login=${login}`, type);
  return res;
};

// 4 Дансны мэдээлэл татах /BALANCE, EQUITY, CREDIT, LEVERAGE, USED MARGIN, FREE MARGIN/
const getMultipleTradeStatesByLogins = async (logins, type) => {
  const res = await authAndGetRequest(
    `/api/user/account/get_batch?login=${logins}`,
    type
  );
  return res;
};

// 5 Дансны харгалзах GROUP-ийг солих
const updateUserGroup = async (login, group, type) => {
  const res = await authAndGetRequest(
    `/api/user/update?login=${login}&group=${group}`,
    type
  );
  return res;
};

// 8 Дансны нууц үг солих
const changeUserPassword = async (login, password, type) => {
  const res = await authAndGetRequest(
    `/api/user/change_password?login=${login}&type=main&password=${password}`,
    type
  );
  return res;
};

// 9 Дансны харгалзах LEVERAGE-ийг солих
const updateUserLeverage = async (login, leverage, type) => {
  const res = await authAndGetRequest(
    `/api/user/update?login=${login}&leverage=${leverage}`,
    type
  );
  return res;
};

// 12 Trading account group-д байгаа арилжааны дансны мэдээллүүдийг татах, шалгах
const getMultipleUserGroups = async (groups, type) => {
  const res = await authAndGetRequest(
    `/api/user/get_batch?group=${groups}`,
    type
  );
  return res;
};

// updateUser("903848", 100, MT5_SERVER_TYPE.DEMO).then((res) => {
//   console.log(res);
// });

// deleteUser("903846", MT5_SERVER_TYPE.DEMO).then((res) => {
//   console.log(res);
// });

// getUser("516892", MT5_SERVER_TYPE.LIVE).then((res) => {
//   console.log(JSON.stringify(res));
// });

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

// getMultipleUserGroups("real\\pro", MT5_SERVER_TYPE.LIVE).then((res) => {
//   console.log("res");
// });
// getMultipleUserGroups("real\\pro", MT5_SERVER_TYPE.LIVE).then((res) => {
//   const jsonData = JSON.stringify(res, null, 2);

//   // Write the JSON data to a file.
//   fs.writeFile("file/output388.json", jsonData, (err) => {
//     if (err) {
//       console.error("Error writing JSON file:", err);
//     } else {
//       console.log("Filtered JSON data saved to", "output388");
//     }
//   });
// });
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

// getMultipleTradeStatesByLogins("903734", MT5_SERVER_TYPE.DEMO).then((res) => {
//   console.log(JSON.stringify(res));
// });

// 12 Дансны мэдээлэл татах /BALANCE, EQUITY, CREDIT, LEVERAGE, USED MARGIN, FREE MARGIN/
const getMultipleTradeStatesByGroups = async (groups, type) => {
  const res = await authAndGetRequest(
    `/api/user/account/get_batch?group=${groups}`,
    type
  );
  return res;
};

// getMultipleTradeStatesByGroups(
//   "demo\\forex-hedge-usd-01",
//   MT5_SERVER_TYPE.DEMO
// ).then((res) => {
//   const jsonData = JSON.stringify(res, null, 2);

//   // Write the JSON data to a file.
//   fs.writeFile("file/output61.json", jsonData, (err) => {
//     if (err) {
//       console.error("Error writing JSON file:", err);
//     } else {
//       console.log("Filtered JSON data saved to", filePath);
//     }
//   });

//   // console.log(JSON.stringify(res));
// });

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

// fixflag — the flag of the need to correct a client's balance and credit funds after the check.
// If fixflag is equal to 1, the client's balance and credit funds are adjusted in accordance with the history of deals.
// If the flag is 0, no correction will be made.
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
