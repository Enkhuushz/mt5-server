const { authAndGetRequest } = require("../mt5Service/MT5Request");
const { EXCLUDE_LOGINS_CREDIT_ZERO } = require("../../lib/constants");
const logger = require("../../config/winston");
const { MT5_SERVER_TYPE } = require("../../lib/constants");

const creditZeroCorrection = async (group, type) => {
  logger.info(
    `creditZeroCorrection Started... group = ${group} type = ${type}`
  );

  const processedUsers = {};

  const res = await authAndGetRequest(
    `/api/user/get_batch?group=${group}`,
    type
  );

  const filteredDatas = res.answer.filter((item) => {
    const parsedBalance = parseFloat(item.Balance);
    const parsedCredit = parseFloat(item.Credit);

    return parsedBalance == 0.0 && parsedCredit < 0.0;
  });

  logger.info(`filteredDatas length: ${filteredDatas.length}`);

  let counter = 0;
  for (const filtered of filteredDatas) {
    if (counter >= 2) {
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
          // If no open positions, get user information
          const userRes = await authAndGetRequest(
            `/api/user/get?login=${login}`,
            type
          );

          if (userRes && userRes.answer.Balance && userRes.answer.Credit) {
            const balance = Math.abs(parseFloat(userRes.answer.Balance));
            const credit = Math.abs(parseFloat(userRes.answer.Credit));

            const parsedUserBalance = parseFloat(userRes.answer.Balance);
            const parsedUserCredit = parseFloat(userRes.answer.Credit);

            if (parsedUserBalance == 0.0 && parsedUserCredit < 0.0) {
              if (credit !== 0) {
                const comment = encodeURIComponent(
                  "Negative credit correction"
                );
                logger.info(
                  `${comment} operation started... userBalance = ${parsedUserBalance} userCredit = ${parsedUserCredit}`
                );

                // Perform the trade balance operation
                const tradeBalanceRes = await authAndGetRequest(
                  `/api/trade/balance?login=${login}&type=${3}&balance=${credit}&comment=${comment}`,
                  type
                );
                logger.info(`tradeBalanceRes ${login}: ${credit} ${comment}`);

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
  logger.info(`creditZeroCorrection End... group = ${group} type = ${type}`);
  return "true";
};

creditZeroCorrection("real\\standart", MT5_SERVER_TYPE.LIVE).then((res) => {
  console.log("res");
});

module.exports = {
  creditZeroCorrection,
};
