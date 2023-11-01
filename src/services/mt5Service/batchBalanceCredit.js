const { authAndGetRequest, authAndPostRequest } = require("./MT5Request");
const { EXCLUDE_LOGINS } = require("../../lib/constants");
const logger = require("../../config/winston");

const batchBalanceLowHighAndCreditLowHigh = async (
  group,
  creditLow,
  creditHigh,
  balanceLow,
  balanceHigh,
  type
) => {
  logger.info(
    `batchBalanceLowHighAndCredit Started... group = ${group} creditLow = ${creditLow} creditHigh = ${creditHigh}  balanceLow = ${balanceLow} balanceHigh = ${balanceHigh} type = ${type}`
  );
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
      parsedCredit > creditLow &&
      parsedCredit <= creditHigh
    );
  });

  logger.info(`filteredDatas length: ${filteredDatas.length}`);

  let counter = 0;
  for (const filtered of filteredDatas) {
    if (counter >= 100) {
      logger.info(
        `============================================================`
      );
      logger.info(`Counter Reached 100 times`);
      break;
    }
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

        if (userRes && userRes.answer.Balance && userRes.answer.Credit) {
          const balance = Math.abs(parseFloat(userRes.answer.Balance));
          const parsedUserBalance = parseFloat(userRes.answer.Balance);
          const parsedUserCredit = parseFloat(userRes.answer.Credit);

          if (
            parsedUserBalance > balanceLow &&
            parsedUserBalance < balanceHigh &&
            parsedUserCredit > creditLow &&
            parsedUserCredit <= creditHigh
          ) {
            if (balance !== 0) {
              const comment = encodeURIComponent("Negative balance correction");
              logger.info(
                `${comment} operation started... userBalance = ${parsedUserBalance} userCredit = ${parsedUserCredit}`
              );

              // Perform the trade balance operation
              const tradeBalanceRes = await authAndGetRequest(
                `/api/trade/balance?login=${login}&type=${5}&balance=${balance}&comment=${comment}`,
                type
              );
              logger.info(`tradeBalanceRes ${login}: ${balance} ${comment}`);

              if (balance < parsedUserCredit) {
                const tradeCreditRes = await authAndGetRequest(
                  `/api/trade/balance?login=${login}&type=${3}&balance=-${balance}&comment=${comment}`,
                  type
                );
                logger.info(`tradeCreditRes ${login}: -${balance} ${comment}`);
              } else {
                const tradeCreditRes = await authAndGetRequest(
                  `/api/trade/balance?login=${login}&type=${3}&balance=-${parsedUserCredit}&comment=${comment}`,
                  type
                );
                logger.info(
                  `tradeCreditRes ${login}: -${parsedUserCredit} ${comment}`
                );
              }

              const userResAfter = await authAndGetRequest(
                `/api/user/get?login=${login}`,
                type
              );
              logger.info(
                `${comment} operation ended... user = ${login} userBalance = ${userResAfter.answer.Balance} userCredit = ${userResAfter.answer.Credit}`
              );
              counter++;
            } else {
              logger.info(`Balance is 0 for login ${login}, skipping.`);
            }
          } else {
            logger.info(
              `User ${login} Balance = ${parsedUserBalance} Credit = ${parsedUserCredit} has changed!!!`
            );
          }
        } else {
          logger.info(`No user information found for login ${login}`);
        }
      } else {
        logger.info(`Login ${login} has open positions, skipping.`);
      }
    }
  }
  logger.info(
    `batchBalanceLowHighAndCredit END... group = ${group} creditLow = ${creditLow} creditHigh = ${creditHigh} balanceLow = ${balanceLow} balanceHigh = ${balanceHigh} type = ${type}`
  );
  return "true";
};

const batchBalanceLowerThanZeroAndCreditZero = async (group, type) => {
  logger.info(
    `batchBalanceLowerThanZeroAndCreditZero Started... group = ${group} type = ${type}`
  );

  const processedUsers = {};

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

  let counter = 0;
  for (const filtered of filteredDatas) {
    if (counter >= 100) {
      logger.info(
        `============================================================`
      );
      logger.info(`Counter Reached 100 times`);
      break;
    }
    logger.info(`============================================================`);

    const login = filtered.Login;
    if (!processedUsers[login]) {
      processedUsers[login] = true;
      if (EXCLUDE_LOGINS.includes(login)) {
        logger.info(`Login ${login} is in the EXCLUDE_LOGINS`);
      } else {
        logger.info(`Login: ${login}`);
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

          if (userRes && userRes.answer.Balance && userRes.answer.Credit) {
            const balance = Math.abs(parseFloat(userRes.answer.Balance));
            const parsedUserBalance = parseFloat(userRes.answer.Balance);
            const parsedUserCredit = parseFloat(userRes.answer.Credit);

            if (parsedUserBalance < 0.0 && parsedUserCredit == 0.0) {
              if (balance !== 0) {
                const comment = encodeURIComponent(
                  "Negative balance correction"
                );
                logger.info(
                  `${comment} operation started... userBalance = ${parsedUserBalance} userCredit = ${parsedUserCredit}`
                );

                // Perform the trade balance operation
                const tradeBalanceRes = await authAndGetRequest(
                  `/api/trade/balance?login=${login}&type=${5}&balance=${balance}&comment=${comment}`,
                  type
                );
                logger.info(`tradeBalanceRes ${login}: ${balance} ${comment}`);

                const userResAfter = await authAndGetRequest(
                  `/api/user/get?login=${login}`,
                  type
                );
                logger.info(
                  `${comment} operation ended... user = ${login} userBalance = ${userResAfter.answer.Balance} userCredit = ${userResAfter.answer.Credit}`
                );
                counter++;
              } else {
                logger.info(`Balance is 0 for login ${login}, skipping.`);
              }
            } else {
              logger.info(
                `User ${login} Balance = ${parsedUserBalance} Credit = ${parsedUserCredit} has changed!!!`
              );
            }
          } else {
            logger.info(`No user information found for login ${login}`);
          }
        } else {
          logger.info(`Login ${login} has open positions, skipping.`);
        }
      }
    }
  }
  logger.info(
    `batchBalanceLowerThanZeroAndCreditZero End... group = ${group} type = ${type}`
  );
  return "true";
};

module.exports = {
  batchBalanceLowHighAndCreditLowHigh,
  batchBalanceLowerThanZeroAndCreditZero,
};
