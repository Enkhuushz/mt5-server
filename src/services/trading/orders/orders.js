const {
  authAndGetRequest,
  authAndPostRequest,
} = require("../../mt5Service/MT5Request");
const logger = require("../../../config/winston");
const { MT5_SERVER_TYPE } = require("../../../lib/constants");

const getOpenOrderByTicket = async (ticket, type) => {
  const res = await authAndGetRequest(`/api/order/get?ticket=${ticket}`, type);
  return res;
};

const getTotalOpenOrder = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/order/get_total?login=${login}`,
    type
  );
  return res;
};

const getMultipleOpenOrderGroup = async (groups, type) => {
  const res = await authAndGetRequest(
    `/api/order/get_batch?group=${groups}`,
    type
  );
  return res;
};

//17 Pending order мэдээлэл татах /ORDER/
const getOpenOrderByPage = async (login, index, number, type) => {
  const res = await authAndGetRequest(
    `/api/order/get_page?login=${login}&offset=${index}&total=${number}`,
    type
  );
  return res;
};

//17 Pending order мэдээлэл засах /ORDER/
const updateOpenOrder = async (order, login, priceTp, type) => {
  const res = await authAndPostRequest(
    `/api/order/update`,
    {
      Order: order,
      Login: login,
      PriceTP: priceTp,
    },
    type
  );
  return res;
};

// updateOpenOrder("190656", "903572", "149.760", MT5_SERVER_TYPE.DEMO).then(
//   (res) => {
//     console.log(res);
//   }
// );

//17 Pending order мэдээлэл устгах /ORDER/
const deleteOpenOrder = async (tickets, type) => {
  const res = await authAndGetRequest(
    `/api/order/delete?ticket=${tickets}`,
    type
  );
  return res;
};

// getOpenOrderByPage("903572", 0, 100, MT5_SERVER_TYPE.DEMO).then((res) => {
//   console.log(res);
// });

const getMultipleOpenOrder = async (logins, groups, tickets, symbol, type) => {
  const res = await authAndGetRequest(
    `/api/order/get_batch?login=${logins}&group=${groups}&ticket=${tickets}&symbol=${symbol}`,
    type
  );
  return res;
};
// getMultipleOpenOrderGroup("real\\pro", MT5_SERVER_TYPE.LIVE).then((res) => {
//   console.log(res);
// });

// deleteOpenOrder("190656", MT5_SERVER_TYPE.DEMO).then((res) => {
//   console.log(res);
// });

const moveOpenOrderToHistory = async (tickets, type) => {
  const res = await authAndGetRequest(
    `/api/order/cancel?ticket=${tickets}`,
    type
  );
  return res;
};

const getClosedOrderByTicket = async (ticket, type) => {
  const res = await authAndGetRequest(
    `/api/history/get?ticket=${ticket}`,
    type
  );
  return res;
};

const getClosedTotalOrder = async (login, fromDate, toDate, type) => {
  const res = await authAndGetRequest(
    `/api/history/get_total?login=${login}&from=${fromDate}&to=${toDate}`,
    type
  );
  return res;
};

const getClosedOrderByPage = async (
  login,
  fromDate,
  toDate,
  index,
  number,
  type
) => {
  const res = await authAndGetRequest(
    `/api/history/get_page?login=${login}&from=${fromDate}&to=${toDate}&offset=${index}&total=${number}`,
    type
  );
  return res;
};

const getClosedOrderByPageNoDate = async (login, index, number, type) => {
  const res = await authAndGetRequest(
    `/api/history/get_page?login=${login}&offset=${index}&total=${number}`,
    type
  );
  return res;
};

// getClosedOrderByPageNoDate("903572", 0, 10, MT5_SERVER_TYPE.DEMO).then(
//   (res) => {
//     console.log(res);
//   }
// );

const getMultipleClosedOrder = async (
  logins,
  groups,
  tickets,
  fromDate,
  toDate,
  symbol,
  type
) => {
  const res = await authAndGetRequest(
    `/api/history/get_batch?login=${logins}&group=${groups}&ticket=${tickets}&from=${fromDate}&to=${toDate}&symbol=${symbol}`,
    type
  );
  return res;
};

const updateClosedOrder = async (order, login, type) => {
  const res = await authAndPostRequest(`/api/history/update`, {}, type);
  return res;
};

const deleteClosedOrder = async (tickets, type) => {
  const res = await authAndGetRequest(
    `/api/history/delete?ticket=${tickets}`,
    type
  );
  return res;
};

module.exports = {
  getOpenOrderByTicket,
  getTotalOpenOrder,
  getMultipleOpenOrderGroup,
  getOpenOrderByPage,
  updateOpenOrder,
  deleteOpenOrder,
  getMultipleOpenOrder,
  moveOpenOrderToHistory,
  getClosedOrderByTicket,
  getClosedTotalOrder,
  getClosedOrderByPage,
  getClosedOrderByPageNoDate,
  getMultipleClosedOrder,
  updateClosedOrder,
  deleteClosedOrder,
};
