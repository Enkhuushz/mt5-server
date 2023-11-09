const { authAndGetRequest, authAndPostRequest } = require("../../MT5Request");

/**
 * Retrieves an open order by its ticket number.
 * @async
 * @param {number} ticket - The ticket number of the order to retrieve.
 * @param {string} type - The type of authentication to use for the request.
 * @returns {Promise<Object>} - A Promise that resolves with the order object.
 */
const getOpenOrderByTicket = async (ticket, type) => {
  const res = await authAndGetRequest(`/api/order/get?ticket=${ticket}`, type);
  return res;
};

/**
 * Retrieves the total number of open orders for a given user login.
 * @async
 * @function getTotalOpenOrder
 * @param {number} login - The user login to retrieve open orders for.
 * @param {string} type - The type of authentication to use for the request.
 * @returns {Promise<number>} - A promise that resolves with the total number of open orders.
 */
const getTotalOpenOrder = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/order/get_total?login=${login}`,
    type
  );
  return res;
};

/**
 * Retrieves multiple open orders for a given group.
 * @async
 * @function getMultipleOpenOrderGroup
 * @param {string} groups - The group of orders to retrieve.
 * @param {string} type - The type of request to make.
 * @returns {Promise} - A promise that resolves with the retrieved orders.
 */
const getMultipleOpenOrderGroup = async (groups, type) => {
  const res = await authAndGetRequest(
    `/api/order/get_batch?group=${groups}`,
    type
  );
  return res;
};

/**
 * Retrieves open orders by page for a given user login.
 * 17 Pending order мэдээлэл татах /ORDER/
 * @async
 * @param {number} login - The user login.
 * @param {number} index - The index of the first order to retrieve.
 * @param {number} number - The number of orders to retrieve.
 * @param {string} type - The type of authentication to use.
 * @returns {Promise<Object>} - The response object containing the open orders.
 */
const getOpenOrderByPage = async (login, index, number, type) => {
  const res = await authAndGetRequest(
    `/api/order/get_page?login=${login}&offset=${index}&total=${number}`,
    type
  );
  return res;
};

/**
 * Update an open order with the given parameters.
 * 17 Pending order мэдээлэл засах /ORDER/
 * @param {Object} order - The order to update.
 * @param {number} login - The user's login ID.
 * @param {number} priceTp - The take profit price.
 * @param {string} type - The type of order to update.
 * @returns {Promise<Object>} - The updated order.
 */
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

/**
 * Deletes an open order with the specified ticket number.
 * 17 Pending order мэдээлэл устгах /ORDER/
 * @param {string} tickets - The ticket number of the order to be deleted.
 * @param {string} type - The type of the order to be deleted.
 * @returns {Promise<Object>} - A Promise that resolves with the response object from the server.
 */
const deleteOpenOrder = async (tickets, type) => {
  const res = await authAndGetRequest(
    `/api/order/delete?ticket=${tickets}`,
    type
  );
  return res;
};

const getMultipleOpenOrder = async (logins, groups, tickets, symbol, type) => {
  const res = await authAndGetRequest(
    `/api/order/get_batch?login=${logins}&group=${groups}&ticket=${tickets}&symbol=${symbol}`,
    type
  );
  return res;
};

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
