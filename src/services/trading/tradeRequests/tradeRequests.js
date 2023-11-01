const {
  authAndGetRequest,
  authAndPostRequest,
} = require("../../mt5Service/MT5Request");
const { MT5_SERVER_TYPE } = require("../../../lib/constants");
const logger = require("../../../config/winston");

// 2 — a balance operation.
// 3 — a credit operation.
// 4 — additional adding/withdrawing.
// 5 — corrective operations.
// 6 — adding bonuses.
// 10 Данс цэнэглэх, зарлага гаргах /DEPOSIT, WITHDRAW REQ/
const depositWithdraw = async (login, operation, sum, comment, type) => {
  const res = await authAndGetRequest(
    `/api/trade/balance?login=${login}&type=${operation}&balance=${sum}&comment=${comment}`,
    type
  );
  return res;
};

// depositWithdraw("903847", "2", 10000.0, "balance", MT5_SERVER_TYPE.DEMO).then(
//   (res) => {
//     console.log(res);
//   }
// );

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
