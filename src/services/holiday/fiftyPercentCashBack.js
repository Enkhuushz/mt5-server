const { MT5_SERVER_TYPE } = require("../../lib/constants");
const logger = require("../../config/winston");
const { authAndGetRequest } = require("../mt5Service/MT5Request");
const { sendError } = require("../../utils/response");

const doFiftyPercentCashBack = async (jsonData, type) => {
  try {
    let count = 0;
    for (const data of jsonData) {
      console.log(data);

      // if (count == 2) {
      //   break;
      // }
      // count++;

      const login = data.login;
      const parsedCashBackAmount = parseFloat(data.amount);
      const comment = encodeURIComponent("MotForex Cashback 11/27-12/03");

      const userRes = await authAndGetRequest(
        `/api/user/get?login=${login}`,
        type
      );

      if (userRes && userRes.answer.Balance && userRes.answer.Credit) {
        const parsedUserBalance = parseFloat(userRes.answer.Balance);
        const parsedUserCredit = parseFloat(userRes.answer.Credit);

        logger.info(
          `${comment} operation started... userBalance = ${parsedUserBalance} userCredit = ${parsedUserCredit} cashBackAmount = ${parsedCashBackAmount}`
        );

        // const tradeBalanceRes = await authAndGetRequest(
        //   `/api/trade/balance?login=${login}&type=${5}&balance=${parsedCashBackAmount}&comment=${comment}`,
        //   type
        // );
        // logger.info(
        //   `tradeBalanceRes ${login}: ${parsedCashBackAmount} ${comment}`
        // );

        const userResAfter = await authAndGetRequest(
          `/api/user/get?login=${login}`,
          type
        );
        logger.info(
          `${comment} operation ended... user = ${login} userBalance = ${userResAfter.answer.Balance} userCredit = ${userResAfter.answer.Credit}`
        );
      } else {
        logger.info(`No user information found for login ${login}`);
      }
    }
  } catch (error) {
    logger.error(`error ${error}`);
    sendError(res, error.message, 500);
  }
};

module.exports = {
  doFiftyPercentCashBack,
};
