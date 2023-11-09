const { authAndGetRequest, authAndPostRequest } = require("../../MT5Request");

const { toTimestamp } = require("../../../utils/utils");

/**
 * Get total deal for a given login within a specified date range.
 * @param {string} login - The login of the user.
 * @param {Date} fromDate - The start date of the date range.
 * @param {Date} toDate - The end date of the date range.
 * @param {string} type - The type of the request.
 * @returns {Promise} - A promise that resolves with the total deal.
 */
const getTotalDeal = async (login, fromDate, toDate, type) => {
  const timestampFrom = toTimestamp(fromDate);
  const timestampTo = toTimestamp(toDate);

  const res = await authAndGetRequest(
    `/api/deal/get_total?login=${login}&from=${timestampFrom}&to=${timestampTo}`,
    type
  );
  return res;
};

/**
 * Retrieves a page of deals for a given user within a specified date range.
 * 13 Get Deal by login date and index
 * @param {number} login - The user's login ID.
 * @param {Date} fromDate - The start date of the date range.
 * @param {Date} toDate - The end date of the date range.
 * @param {number} index - The index of the first deal to retrieve.
 * @param {number} number - The number of deals to retrieve.
 * @param {string} type - The type of authentication to use.
 * @returns {Promise<Object>} - A Promise that resolves to an object containing the requested deals.
 */
const getDealByPage = async (login, fromDate, toDate, index, number, type) => {
  const timestampFrom = toTimestamp(fromDate);
  const timestampTo = toTimestamp(toDate);

  const res = await authAndGetRequest(
    `/api/deal/get_page?login=${login}&from=${timestampFrom}&to=${timestampTo}&offset=${index}&total=${number}`,
    type
  );
  return res;
};

/**
 * Retrieves deals by page with a specified date range and type.
 * 13 Get Deal by login only Date
 * @param {number} login - The user's login ID.
 * @param {Date} fromDate - The start date of the date range.
 * @param {Date} toDate - The end date of the date range.
 * @param {string} type - The type of deal to retrieve.
 * @returns {Promise} - A promise that resolves with the retrieved deals.
 */
const getDealByPageOnlyDate = async (login, fromDate, toDate, type) => {
  const timestampFrom = toTimestamp(fromDate);
  const timestampTo = toTimestamp(toDate);

  const res = await authAndGetRequest(
    `/api/deal/get_page?login=${login}&from=${timestampFrom}&to=${timestampTo}`,
    type
  );
  return res;
};

/**
 * Retrieves a page of deals for a given login, offset, and total number of deals.
 * 13 Get Deal by login only index
 * @param {number} login - The login ID of the user whose deals are being retrieved.
 * @param {number} index - The offset index of the first deal to retrieve.
 * @param {number} number - The total number of deals to retrieve.
 * @param {string} type - The type of authentication to use for the request.
 * @returns {Promise<Object>} - A Promise that resolves with the retrieved deals.
 */
const getDealByPageNoDate = async (login, index, number, type) => {
  const res = await authAndGetRequest(
    `/api/deal/get_page?login=${login}&offset=${index}&total=${number}`,
    type
  );
  return res;
};

/**
 * Retrieves multiple deal groups within a specified date range.
 * 13 Get Deal by group
 * @param {string} groups - The comma-separated list of deal groups to retrieve.
 * @param {Date} fromDate - The start date of the date range.
 * @param {Date} toDate - The end date of the date range.
 * @param {string} type - The type of the request.
 * @returns {Promise<Object>} - The response object containing the retrieved deal groups.
 */
const getMultipleDealGroup = async (groups, fromDate, toDate, type) => {
  const timestampFrom = toTimestamp(fromDate);
  const timestampTo = toTimestamp(toDate);

  const res = await authAndGetRequest(
    `/api/deal/get_batch?group=${groups}&from=${timestampFrom}&to=${timestampTo}`,
    type
  );
  return res;
};

/**
 * Updates a deal with the given parameters.
 * 14 Арилжааны түүх засах
 * @param {Object} deal - The deal object to update.
 * @param {string} externalId - The external ID of the deal.
 * @param {number} login - The login ID of the user who made the deal.
 * @param {number} priceTp - The take profit price of the deal.
 * @param {string} type - The type of the deal.
 * @returns {Promise<Object>} - A promise that resolves to the updated deal object.
 */
const updateDeal = async (deal, externalId, login, priceTp, type) => {
  const res = await authAndPostRequest(
    `/api/deal/update`,
    {
      Deal: deal,
      ExternalID: externalId,
      Login: login,
      PriceTP: priceTp,
    },
    type
  );
  return res;
};

/**
 * Deletes a deal with the specified ticket number.
 * 15 Арилжааны түүх устгах
 * @param {string} tickets - The ticket number of the deal to be deleted.
 * @param {string} type - The type of authentication to be used for the request.
 * @returns {Promise<Object>} - A Promise that resolves with the response data from the server.
 */
const deleteDeal = async (tickets, type) => {
  const res = await authAndGetRequest(
    `/api/deal/delete?ticket=${tickets}`,
    type
  );
  return res;
};

/**
 * Retrieves a deal by its ticket number.
 * @param {number} ticket - The ticket number of the deal to retrieve.
 * @param {string} type - The type of authentication to use for the request.
 * @returns {Promise<Object>} - A Promise that resolves with the deal object.
 */
const getDealByTicket = async (ticket, type) => {
  const res = await authAndGetRequest(`/api/deal/get?ticket=${ticket}`, type);
  return res;
};

const getMultipleDeal = async (
  logins,
  groups,
  tickets,
  fromDate,
  toDate,
  symbol,
  type
) => {
  const res = await authAndGetRequest(
    `/api/deal/get_batch?login=${logins}&group=${groups}&ticket=${tickets}&from=${fromDate}&to=${toDate}&symbol=${symbol}`,
    type
  );
  return res;
};

module.exports = {
  getTotalDeal,
  getDealByPage,
  getDealByPageOnlyDate,
  getDealByPageNoDate,
  getMultipleDealGroup,
  updateDeal,
  deleteDeal,
  getMultipleDeal,
  getDealByTicket,
};
