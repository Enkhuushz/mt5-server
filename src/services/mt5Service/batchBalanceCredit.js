const { authAndGetRequest, authAndPostRequest } = require("./MT5Request");
const { MT5_GROUP_TYPE, MT5_SERVER_TYPE } = require("../../lib/constants");
const { log } = require("winston");
const logger = require("../../config/winston");
const fs = require("fs");

const batchBalanceLowHighAndCredit = async (
  group,
  credit,
  balanceLow,
  balanceHigh,
  type
) => {
  logger.info(`batchBalanceLowHighAndCredit Started...`);
  const processedUsers = {};

  const res = await authAndGetRequest(
    `/api/user/get_batch?group=${group}`,
    type
  );

  const filteredDatas = res.answer.filter((item) => {
    const parsedBalance = parseFloat(item.Balance);
    const parsedCredit = parseFloat(item.Credit);

    return (
      parsedBalance > balanceLow &&
      parsedBalance < balanceHigh &&
      parsedCredit == credit
    );
  });
  logger.info(`filteredDatas length: ${filteredDatas.length}`);

  for (const filtered of filteredDatas) {
    logger.info(`============================================================`);
    const login = filtered.Login;
    if (!processedUsers[login]) {
      processedUsers[login] = true;
      logger.info(`Login: ${login}`);
      // Check if the user has an open position
      const positionRes = await authAndGetRequest(
        `/api/position/get_page?login=${login}&offset=0&total=1`,
        type
      );
      logger.info(`positionRes: ${JSON.stringify(positionRes.answer)}`);

      if (positionRes.answer.length === 0) {
        // If no open positions, get user information
        const userRes = await authAndGetRequest(
          `/api/user/get?login=${login}`,
          type
        );
        logger.info(`userRes: ${JSON.stringify(userRes.answer)}`);

        if (userRes && userRes.answer.Balance && userRes.answer.Credit) {
          const balance = Math.abs(parseFloat(userRes.answer.Balance));
          if (balance !== 0) {
            const comment = encodeURIComponent("Negative balance correction");

            // Perform the trade balance operation
            const tradeBalanceRes = await authAndGetRequest(
              `/api/trade/balance?login=${login}&type=${5}&balance=${balance}&comment=${comment}`,
              type
            );
            logger.info(`tradeBalanceRes ${login}: ${tradeBalanceRes}`);

            if (balance < credit) {
              const tradeCreditRes = await authAndGetRequest(
                `/api/trade/balance?login=${login}&type=${3}&balance=-${balance}&comment=${comment}`,
                type
              );
              logger.info(`tradeCreditRes ${login}: ${tradeCreditRes}`);
            } else {
              const tradeCreditRes = await authAndGetRequest(
                `/api/trade/balance?login=${login}&type=${3}&balance=-${credit}&comment=${comment}`,
                type
              );
              logger.info(`tradeCreditRes ${login}: ${tradeCreditRes}`);
            }
            fs.appendFile(
              "file/duplicatedLogins.txt",
              `Login: ${login}\n`,
              (err) => {
                if (err) {
                  logger.error(`Error appending to file: ${err}`);
                }
              }
            );
          } else {
            logger.info(`Balance is 0 for login ${login}, skipping.`);
          }
        } else {
          logger.info(`No user information found for login ${login}`);
        }
      } else {
        logger.info(`Login ${login} has open positions, skipping.`);
      }
    }
  }
  logger.info(`batchBalanceLowHighAndCredit END...`);
  return "true";
};

const batchBalanceLowerThanZeroAndCreditZero = async (group, type) => {
  logger.info(`batchBalanceLowerThanZeroAndCreditZero Started...`);
  const res = await authAndGetRequest(
    `/api/user/get_batch?group=${group}`,
    type
  );

  const filteredDatas = res.answer.filter((item) => {
    const parsedBalance = parseFloat(item.Balance);
    const parsedCredit = parseFloat(item.Credit);

    return parsedBalance < 0.0 && parsedCredit == 0.0;
  });

  logger.info(`filteredDatas length: ${filteredDatas.length}`);

  for (const filtered of filteredDatas) {
    // Check if the user has an open position
    const login = filtered.Login;
    if (login.startsWith("100")) {
      logger.info(`Login ${login} starts with 100`);
    } else {
      logger.info(`Login: ${login}`);
      const positionRes = await authAndGetRequest(
        `/api/position/get_page?login=${login}&offset=0&total=1`,
        type
      );
      logger.info(`positionRes: ${JSON.stringify(positionRes)}`);

      if (positionRes.answer.length === 0) {
        // If no open positions, get user information
        const userRes = await authAndGetRequest(
          `/api/user/get?login=${login}`,
          type
        );
        logger.info(`userRes: ${JSON.stringify(userRes)}`);

        if (userRes && userRes.answer.Balance && userRes.answer.Credit) {
          const balance = Math.abs(parseFloat(userRes.answer.Balance));
          if (balance !== 0) {
            const comment = encodeURIComponent("Negative balance correction");

            // Perform the trade balance operation
            const tradeBalanceRes = await authAndGetRequest(
              `/api/trade/balance?login=${login}&type=${5}&balance=${balance}&comment=${comment}`,
              type
            );
            logger.info(`tradeBalanceRes: ${tradeBalanceRes}`);
          } else {
            logger.info(`Balance is 0 for login ${login}, skipping.`);
          }
        } else {
          logger.info(`No user information found for login ${login}`);
        }
      } else {
        logger.info(`Login ${login} has open positions, skipping.`);
      }
    }
  }
  logger.info(`batchBalanceLowHighAndCredit END...`);

  return "true";
};

module.exports = {
  batchBalanceLowHighAndCredit,
  batchBalanceLowerThanZeroAndCreditZero,
};
