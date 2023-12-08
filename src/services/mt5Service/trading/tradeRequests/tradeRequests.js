const { authAndGetRequest, authAndPostRequest } = require("../../MT5Request");
const logger = require("../../../../config/winston");

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

const creditzero = async (login, type) => {
  console.log(login);

  const positionRes = await authAndGetRequest(
    `/api/position/get_page?login=${login}&offset=0&total=1`,
    type
  );
  logger.info(`positionRes: ${JSON.stringify(positionRes.answer)}`);

  if (positionRes.answer.length === 0) {
    const userRes = await authAndGetRequest(
      `/api/user/get?login=${login}`,
      type
    );

    if (userRes && userRes.answer.Balance && userRes.answer.Credit) {
      const credit = Math.abs(parseFloat(userRes.answer.Credit));
      const parsedUserCredit = parseFloat(userRes.answer.Credit);

      logger.info(
        `userRes = ${login} userBalance = ${userRes.answer.Balance} userCredit = ${userRes.answer.Credit}`
      );

      if (parsedUserCredit > 0) {
        const comment = encodeURIComponent("BONUS OPERATION");
        const tradeCreditRes = await authAndGetRequest(
          `/api/trade/balance?login=${login}&type=${3}&balance=-${credit}&comment=${comment}`,
          type
        );

        logger.info(`tradeCreditRes ${login}: ${credit} ${comment}`);

        const userResAfter = await authAndGetRequest(
          `/api/user/get?login=${login}`,
          type
        );
        logger.info(
          `${comment} operation ended... user = ${login} userBalance = ${userResAfter.answer.Balance} userCredit = ${userResAfter.answer.Credit}`
        );
      } else {
        logger.info(
          `${login} userCredit = ${userRes.answer.Credit} is not greater than 0`
        );
        return `${login} userCredit = ${userRes.answer.Credit} is not greater than 0`;
      }
    } else {
      logger.info(`No User information`);
      return "No User information";
    }
  } else {
    logger.info(`Login ${login} has open positions, skipping.`);
    return "Login ${login} has open positions, skipping.";
  }
  return "true";
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
  creditzero,
  checkMargin,
  calculateProfitForPosition,
  sendRequest,
  getRequestResult,
};
