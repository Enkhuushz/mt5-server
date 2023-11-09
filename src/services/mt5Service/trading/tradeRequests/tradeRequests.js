const { authAndGetRequest, authAndPostRequest } = require("../../MT5Request");

/**
 * Deposit or withdraw funds from a user's trading account.
 * 2 — a balance operation.
   3 — a credit operation.
   4 — additional adding/withdrawing.
   5 — corrective operations.
   6 — adding bonuses.
   10 Данс цэнэглэх, зарлага гаргах /DEPOSIT, WITHDRAW REQ/
 * @param {number} login - The user's login ID.
 * @param {string} operation - The type of operation to perform (either "deposit" or "withdraw").
 * @param {number} sum - The amount of funds to deposit or withdraw.
 * @param {string} comment - A comment to attach to the transaction.
 * @param {string} type - The type of request to make (either "api" or "manager").
 * @returns {Promise<Object>} - A Promise that resolves with the response data from the server.
 */
const depositWithdraw = async (login, operation, sum, comment, type) => {
  const res = await authAndGetRequest(
    `/api/trade/balance?login=${login}&type=${operation}&balance=${sum}&comment=${comment}`,
    type
  );
  return res;
};

const checkMargin = async (login, symbol, operation, volume, price, type) => {
  const res = await authAndGetRequest(
    `/api/trade/check_margin?login=${login}&symbol=${symbol}&type=${operation}&volume=${volume}&price=${price}`,
    type
  );
  return res;
};

const calculateProfitForPosition = async (
  group,
  symbol,
  operation,
  volume,
  openPrice,
  closePrice,
  type
) => {
  const res = await authAndGetRequest(
    `/api/trade/calc_profit?group=${group}&symbol=${symbol}&type=${operation}&volume=${volume}&price_open=${openPrice}&price_close=${closePrice}`,
    type
  );
  return res;
};

const sendRequest = async (
  group,
  symbol,
  operation,
  volume,
  openPrice,
  closePrice,
  type
) => {
  const res = await authAndPostRequest(
    `/api/dealer/send_request`,
    {
      Action: "200",
      Login: "1010",
      Symbol: "EURUSD",
      Volume: "100",
      TypeFill: "0",
      Type: "0",
      PriceOrder: "1.11850",
      Digits: "5",
    },
    type
  );
  return res;
};

const getRequestResult = async (identifiers, type) => {
  const res = await authAndGetRequest(
    `/api/dealer/get_request_result?id=${identifiers}`,
    type
  );
  return res;
};

module.exports = {
  depositWithdraw,
  checkMargin,
  calculateProfitForPosition,
  sendRequest,
  getRequestResult,
};
