const { authAndGetRequest } = require("../../services/mt5Service/MT5Request");
const { MT5_SERVER_TYPE } = require("../../lib/constants");
const logger = require("../../config/winston");
const fs = require("fs");
const { toTimestamp } = require("../../utils/utils");
const { generateJson } = require("../../utils/file");

function readNumbersFromFile(callback) {
  const filePath = "file/loginCorrection.txt";

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading text file:", err);
      callback(err, null);
    } else {
      const numbers = data.trim().split("\n");
      callback(null, numbers);
    }
  });
}

const first = async (fromDate, toDate, type) => {
  try {
    readNumbersFromFile(async (err, jsonData) => {
      let index = 0;
      for (const login of jsonData) {
        if (index == 300) {
          break;
        } else {
          if (login.length > 4) {
            const timestampFrom = toTimestamp(fromDate);
            const timestampTo = toTimestamp(toDate);

            const resUserInfo = await authAndGetRequest(
              `/api/user/account/get_batch?login=${login}`,
              type
            );

            console.log(login);

            const credit = parseFloat(resUserInfo.answer[0].Credit);
            const equity = parseFloat(resUserInfo.answer[0].Equity);

            console.log(
              `login: ${login}, credit: ${credit}, equity: ${equity}`
            );

            if (credit == -50.0 && equity == -50.0) {
              console.log(resUserInfo.answer[0]);

              const comment = encodeURIComponent("Negative balance correction");
              const commentBonus = encodeURIComponent(
                "Урамшууллын хугацаа сунгагдсан"
              );

              const balance = 50;

              const tradeBalanceRes = await authAndGetRequest(
                `/api/trade/balance?login=${login}&type=${3}&balance=${balance}&comment=${comment}`,
                type
              );
              logger.info(`tradeBalanceRes ${login}: ${balance} ${comment}`);

              const tradeBalanceBonusRes = await authAndGetRequest(
                `/api/trade/balance?login=${login}&type=${3}&balance=${balance}&comment=${commentBonus}`,
                type
              );
              logger.info(
                `tradeBalanceRes ${login}: ${balance} ${commentBonus}`
              );

              const resUserInfoAfter = await authAndGetRequest(
                `/api/user/account/get_batch?login=${login}`,
                type
              );
              console.log(
                `Credit: ${resUserInfoAfter.answer[0].Credit}, Equity: ${resUserInfoAfter.answer[0].Equity}`
              );
              index++;
            }
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const second = async (fromDate, toDate, type) => {
  try {
    readNumbersFromFile(async (err, jsonData) => {
      let index = 0;
      for (const login of jsonData) {
        if (index == 800) {
          break;
        } else {
          if (login.length > 3) {
            const timestampFrom = toTimestamp(fromDate);
            const timestampTo = toTimestamp(toDate);

            const resUserInfo = await authAndGetRequest(
              `/api/user/account/get_batch?login=${login}`,
              type
            );

            console.log(login);

            const credit = parseFloat(resUserInfo.answer[0].Credit);
            const equity = parseFloat(resUserInfo.answer[0].Equity);

            console.log(
              `login: ${login}, credit: ${credit}, equity: ${equity}`
            );

            if (credit < 0 && credit >= -50.0 && equity >= -50.0) {
              console.log(resUserInfo.answer[0]);

              const comment = encodeURIComponent("Negative balance correction");

              if (equity > 0) {
                const b = Math.abs(credit).toFixed(2);

                const tradeBalanceRes = await authAndGetRequest(
                  `/api/trade/balance?login=${login}&type=${3}&balance=${b}&comment=${comment}`,
                  type
                );

                logger.info(`tradeBalanceRes ${login}: ${b} ${comment}`);

                const resUserInfoAfter = await authAndGetRequest(
                  `/api/user/account/get_batch?login=${login}`,
                  type
                );
                console.log(
                  `Credit: ${resUserInfoAfter.answer[0].Credit}, Equity: ${resUserInfoAfter.answer[0].Equity}`
                );
                index++;
              } else {
                const balance = 50;

                const tradeBalanceRes = await authAndGetRequest(
                  `/api/trade/balance?login=${login}&type=${3}&balance=${balance}&comment=${comment}`,
                  type
                );
                logger.info(`tradeBalanceRes ${login}: ${balance} ${comment}`);

                const resUserInfoAfter = await authAndGetRequest(
                  `/api/user/account/get_batch?login=${login}`,
                  type
                );
                console.log(
                  `Credit: ${resUserInfoAfter.answer[0].Credit}, Equity: ${resUserInfoAfter.answer[0].Equity}`
                );
                index++;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

first("2023-08-01 00:00:00", "2023-11-07 23:00:00", MT5_SERVER_TYPE.LIVE).then(
  (res) => {
    console.log("res");
  }
);
