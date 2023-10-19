const { authAndGetRequest, authAndPostRequest } = require("./MT5Request");
const { MT5_SERVER_TYPE } = require("../../lib/constants");
const { log } = require("winston");
const logger = require("../../config/winston");
// "real\\pro", "real\\standart"
// 50.0

const batchBalanceLowHighAndCredit = async (
  group,
  credit,
  balanceLow,
  balanceHigh,
  type
) => {
  logger.info(`batchBalanceLowHighAndCredit Started...`);

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
    const login = filtered.Login;
    logger.info(`Login: ${login}`);
    // Check if the user has an open position
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

          if (balance < credit) {
            const tradeCreditRes = await authAndGetRequest(
              `/api/trade/balance?login=${login}&type=${3}&balance=-${balance}&comment=${comment}`,
              type
            );
            logger.info(`tradeCreditRes: ${tradeCreditRes}`);
          } else {
            const tradeCreditRes = await authAndGetRequest(
              `/api/trade/balance?login=${login}&type=${3}&balance=-${credit}&comment=${comment}`,
              type
            );
            logger.info(`tradeCreditRes: ${tradeCreditRes}`);
          }
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
  logger.info(`batchBalanceLowHighAndCredit END...`);
  return "true";
};

// "real\\pro", "real\\standart"
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

batchBalanceLowHighAndCredit(
  "real\\pro",
  50.0,
  -72,
  0,
  MT5_SERVER_TYPE.LIVE
).then((res) => console.log(res));

module.exports = {
  batchBalanceLowHighAndCredit,
  batchBalanceLowerThanZeroAndCreditZero,
};
