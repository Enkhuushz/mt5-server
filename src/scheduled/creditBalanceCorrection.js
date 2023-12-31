const { authAndGetRequest } = require("../services/mt5Service/MT5Request");
const {
  EXCLUDE_LOGINS_CREDIT_ZERO,
  MT5_SERVER_TYPE,
} = require("../lib/constants");
const logger = require("../config/winston");

const creditBalanceZeroCorrection = async (group, type) => {
  logger.info(
    `creditBalanceZeroCorrection Started... group = ${group} type = ${type}`
  );

  const processedUsers = {};

  const res = await authAndGetRequest(
    `/api/user/get_batch?group=${group}`,
    type
  );

  const filteredDatas = res.answer.filter((item) => {
    const parsedBalance = parseFloat(item.Balance);
    const parsedCredit = parseFloat(item.Credit);

    return parsedBalance < 0.0 && parsedCredit < 0.0;
  });

  logger.info(`filteredDatas length: ${filteredDatas.length}`);

  let counter = 0;
  for (const filtered of filteredDatas) {
    if (counter >= 10) {
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
      if (EXCLUDE_LOGINS_CREDIT_ZERO.includes(login)) {
        logger.info(`Login ${login} is in the EXCLUDE_LOGINS_CREDIT_ZERO`);
      } else {
        logger.info(`Login: ${login}`);
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
            const balance = Math.abs(parseFloat(userRes.answer.Balance));
            const credit = Math.abs(parseFloat(userRes.answer.Credit));

            const parsedUserBalance = parseFloat(userRes.answer.Balance);
            const parsedUserCredit = parseFloat(userRes.answer.Credit);

            if (parsedUserBalance < 0.0 && parsedUserCredit < 0.0) {
              if (credit !== 0 && balance !== 0) {
                const comment = encodeURIComponent(
                  "Negative credit correction"
                );
                const commentBalance = encodeURIComponent(
                  "Negative balance correction"
                );
                logger.info(
                  `${comment} operation started... userBalance = ${parsedUserBalance} userCredit = ${parsedUserCredit}`
                );

                const tradeBalanceRes = await authAndGetRequest(
                  `/api/trade/balance?login=${login}&type=${5}&balance=${balance}&comment=${commentBalance}`,
                  type
                );
                logger.info(
                  `tradeBalanceRes ${login}: ${balance} ${commentBalance}`
                );

                const tradeCreditRes = await authAndGetRequest(
                  `/api/trade/balance?login=${login}&type=${3}&balance=${credit}&comment=${comment}`,
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
                counter++;
              } else {
                logger.info(`Credit is 0 for login ${login}, skipping.`);
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
    `creditBalanceZeroCorrection End... group = ${group} type = ${type}`
  );
  return "true";
};

module.exports = {
  creditBalanceZeroCorrection,
};
