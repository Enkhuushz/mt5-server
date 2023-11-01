const {
  authAndGetRequest,
  authAndPostRequest,
} = require("../../mt5Service/MT5Request");
const { MT5_SERVER_TYPE } = require("../../../lib/constants");
const logger = require("../../../config/winston");
const fs = require("fs");

const getPositionBySymbol = async (login, symbol, type) => {
  const res = await authAndGetRequest(
    `/api/position/get?${login}=login&symbol=${symbol}`,
    type
  );
  return res;
};

const getTotalPosition = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/position/get_total?login=${login}`,
    type
  );
  return res;
};
// 16 Нээлттэй арилжаануудын мэдээлэл татах
const getPositionByPage = async (login, index, number, type) => {
  const res = await authAndGetRequest(
    `/api/position/get_page?login=${login}&offset=${index}&total=${number}`,
    type
  );
  return res;
};

// getPositionByPage("903572", 0, 100, MT5_SERVER_TYPE.DEMO).then((res) => {
//   console.log(res);
// });

const getMultiplePosition = async (logins, groups, tickets, symbols, type) => {
  const res = await authAndGetRequest(
    `/api/position/get_batch?login=${logins}&group=${groups}&ticket=${tickets}&symbol=${symbols}`,
    type
  );
  return res;
};

const getMultiplePositionGroup = async (groups, type) => {
  const res = await authAndGetRequest(
    `/api/position/get_batch?group=${groups}`,
    type
  );

  res.answer.sort((a, b) => b.Profit - a.Profit);

  // const json = JSON.stringify(res.answer, null, 2);

  // // Write the JSON data to a file.
  // fs.writeFile("filev2/positition.json", json, (err) => {
  //   if (err) {
  //     console.error("Error writing JSON file:", err);
  //   } else {
  //     console.log("Filtered JSON data saved to", "file/positition.json");
  //   }
  // });

  return res;
};

// getMultiplePositionGroup("real\\pro", MT5_SERVER_TYPE.LIVE).then((res) => {
//   console.log("res");
// });

// 16 Нээлттэй арилжаануудын мэдээлэл засах
const updatePosition = async (position, externalId, login, priceTp, type) => {
  const res = await authAndPostRequest(
    `/api/position/update`,
    {
      Position: position,
      ExternalID: externalId,
      Login: login,
      PriceTP: priceTp,
    },
    type
  );
  return res;
};
// updatePosition(
//   "190380",
//   "D546B5D5EBBADC39",
//   "903572",
//   "149.850",
//   MT5_SERVER_TYPE.DEMO
// ).then((res) => {
//   console.log(res);
// });

// 16 Нээлттэй арилжаануудын мэдээлэл устгах
const deletePosition = async (tickets, type) => {
  const res = await authAndGetRequest(
    `/api/position/delete?ticket=${tickets}`,
    type
  );
  return res;
};
// deletePosition("190380", MT5_SERVER_TYPE.DEMO).then((res) => {
//   console.log(res);
// });

const checkPosition = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/position/check?login=${login}`,
    type
  );
  return res;
};

const fixPosition = async (login, type) => {
  const res = await authAndGetRequest(`/api/position/fix?login=${login}`, type);
  return res;
};

module.exports = {
  getPositionBySymbol,
  getTotalPosition,
  getPositionByPage,
  getMultiplePosition,
  getMultiplePositionGroup,
  updatePosition,
  deletePosition,
  checkPosition,
  fixPosition,
};
