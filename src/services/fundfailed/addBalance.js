const logger = require("../../config/winston");
const { authAndGetRequest } = require("../mt5Service/MT5Request");
const { sendError } = require("../../utils/response");
const { log } = require("winston");

const addBalance = async (jsonData, type) => {
  try {
    let count = 0;

    for (const data of jsonData) {
      //   if (count == 1) {
      //     break;
      //   }

      const login = data.login;
      const group = data.pluginGroup;
      const email = data.email;
      const profit = data.profit;

      const userRes = await authAndGetRequest(
        `/api/user/get?login=${login}`,
        type
      );
      logger.info(`++++++++++++++++++++++++++++++++++++++`);
      logger.info(`login : ${login}`);

      if (userRes && userRes?.answer?.Balance && userRes?.answer?.Credit) {
        if (group === userRes.answer.Group && email === userRes.answer.Email) {
          const parsedUserBalance = parseFloat(userRes.answer.Balance);
          const parsedUserCredit = parseFloat(userRes.answer.Credit);

          logger.info(
            ` operation started... userBalance = ${parsedUserBalance} userCredit = ${parsedUserCredit} cashBackAmount = ${profit}`
          );

          const tradeBalanceRes = await authAndGetRequest(
            `/api/trade/balance?login=${login}&type=${5}&balance=${profit}&comment=`,
            type
          );

          logger.info(`tradeBalanceRes ${login}: ${profit}`);

          const userResAfter = await authAndGetRequest(
            `/api/user/get?login=${login}`,
            type
          );
          logger.info(
            ` operation ended... user = ${login} userBalance = ${userResAfter.answer.Balance} userCredit = ${userResAfter.answer.Credit}`
          );
          count++;
        } else {
          logger.info(
            `Not equal user information found for login: ${login} or group: ${group}`
          );
        }
      } else {
        logger.info(
          `No user information found for login ${login} and group ${group}`
        );
      }
    }
  } catch (error) {
    logger.error(error);
  }
};

const recoverAddBalance = async (jsonData, type) => {
  try {
    let count = 0;

    for (const data of jsonData) {
      const login = data.login;
      const profit = data.profit;

      const userRes = await authAndGetRequest(
        `/api/user/get?login=${login}`,
        type
      );
      logger.info(`++++++++++++++++++++++++++++++++++++++`);
      logger.info(`login : ${login}`);

      if (userRes && userRes?.answer?.Balance && userRes?.answer?.Credit) {
        const parsedUserBalance = parseFloat(userRes.answer.Balance);
        const parsedUserCredit = parseFloat(userRes.answer.Credit);

        logger.info(
          ` operation started... userBalance = ${parsedUserBalance} userCredit = ${parsedUserCredit} cashBackAmount = ${profit}`
        );

        const tradeBalanceRes = await authAndGetRequest(
          `/api/trade/balance?login=${login}&type=${5}&balance=${profit}&comment=`,
          type
        );

        logger.info(`tradeBalanceRes ${login}: ${profit}`);

        const userResAfter = await authAndGetRequest(
          `/api/user/get?login=${login}`,
          type
        );
        logger.info(
          ` operation ended... user = ${login} userBalance = ${userResAfter.answer.Balance} userCredit = ${userResAfter.answer.Credit}`
        );
        count++;
      } else {
        logger.info(`No user information found for login ${login}`);
      }
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  addBalance,
  recoverAddBalance,
};
