const { authAndGetRequest, authAndPostRequest } = require("../../MT5Request");

/**
 * Retrieves multiple positions for a given group.
 *
 * @async
 * @function getMultiplePositionGroup
 * @param {string} groups - The group of positions to retrieve.
 * @param {string} type - The type of request to make.
 * @returns {Promise} A promise that resolves with the retrieved positions.
 */
const getMultiplePositionGroup = async (groups, type) => {
  const res = await authAndGetRequest(
    `/api/position/get_batch?group=${groups}`,
    type
  );
  return res;
};

/**
 * Get position by symbol for a given login.
 *
 * @param {number} login - The user login ID.
 * @param {string} symbol - The symbol of the position.
 * @param {string} type - The type of the position.
 * @returns {Promise} - A promise that resolves with the position data.
 */
const getPositionBySymbol = async (login, symbol, type) => {
  const res = await authAndGetRequest(
    `/api/position/get?${login}=login&symbol=${symbol}`,
    type
  );
  return res;
};

/**
 * Get total position for a given login and type.
 *
 * @async
 * @function getTotalPosition
 * @param {number} login - The login ID of the user.
 * @param {string} type - The type of position.
 * @returns {Promise<Object>} - The total position object.
 */
const getTotalPosition = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/position/get_total?login=${login}`,
    type
  );
  return res;
};

/**
 * Retrieves a page of positions for a given login.
 * 16 Нээлттэй арилжаануудын мэдээлэл татах
 * @param {number} login - The login ID of the user.
 * @param {number} index - The index of the first position to retrieve.
 * @param {number} number - The number of positions to retrieve.
 * @param {string} type - The type of request to make (e.g. 'demo' or 'real').
 * @returns {Promise<Object>} - A Promise that resolves to an object containing the requested positions.
 */
const getPositionByPage = async (login, index, number, type) => {
  const res = await authAndGetRequest(
    `/api/position/get_page?login=${login}&offset=${index}&total=${number}`,
    type
  );
  return res;
};

/**
 * Updates a position with the given parameters.
 * 16 Нээлттэй арилжаануудын мэдээлэл засах
 * @param {Object} position - The position object to update.
 * @param {string} externalId - The external ID of the position.
 * @param {number} login - The login ID of the user.
 * @param {number} priceTp - The take profit price of the position.
 * @param {string} type - The type of the position.
 * @returns {Promise<Object>} - A promise that resolves with the updated position object.
 */
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

/**
 * Deletes a position with the specified ticket number.
 * 16 Нээлттэй арилжаануудын мэдээлэл устгах
 * @param {string} tickets - The ticket number of the position to be deleted.
 * @param {string} type - The type of the position to be deleted.
 * @returns {Promise} A Promise that resolves with the response from the server.
 */
const deletePosition = async (tickets, type) => {
  const res = await authAndGetRequest(
    `/api/position/delete?ticket=${tickets}`,
    type
  );
  return res;
};

/**
 * Retrieves multiple positions based on the provided filters.
 *
 * @param {string} logins - Comma-separated list of login IDs to filter by.
 * @param {string} groups - Comma-separated list of group names to filter by.
 * @param {string} tickets - Comma-separated list of ticket numbers to filter by.
 * @param {string} symbols - Comma-separated list of symbol names to filter by.
 * @param {string} type - The type of request to make (e.g. 'GET', 'POST').
 * @returns {Promise} A Promise that resolves with the response data.
 */
const getMultiplePosition = async (logins, groups, tickets, symbols, type) => {
  const res = await authAndGetRequest(
    `/api/position/get_batch?login=${logins}&group=${groups}&ticket=${tickets}&symbol=${symbols}`,
    type
  );
  return res;
};

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
  getMultiplePositionGroup,
  getPositionBySymbol,
  getTotalPosition,
  getPositionByPage,
  updatePosition,
  deletePosition,
  getMultiplePosition,
  checkPosition,
  fixPosition,
};
