const { authAndGetRequest, authAndPostRequest } = require("./MT5Request");
const { MT5_SERVER_TYPE } = require("../../lib/constants");
const { log } = require("winston");

const getTotalPositionPage = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/position/get_page?login=${login}&offset=0&total=3`,
    type
  );
  return res;
};
const getUser = async (login, type) => {
  const res = await authAndGetRequest(`/api/user/get?login=${login}`, type);
  return res;
};

const deposit = async (login, typee, balance, comment, type) => {
  const res = await authAndGetRequest(
    `/api/trade/balance?login=${login}&type=${typee}&balance=${balance}&comment=${comment}`,
    type
  );
  return res;
};

const batchBalanceZero = async (type) => {
  const group = "real\\pro";
  const res = await authAndGetRequest(
    `/api/user/get_batch?group=${group}`,
    type
  );

  const filteredDatas = res.answer.filter((item) => {
    const balance = parseFloat(item.Balance);
    return balance > -40.0 && balance < 0.0 && item.Credit === "50.00";
  });

  console.log(filteredDatas.length);

  for (const filtered of filteredDatas) {
    // Check if the user has an open position
    const login = filtered.Login;
    console.log(login);
    const positionRes = await authAndGetRequest(
      `/api/position/get_page?login=${login}&offset=0&total=1`,
      type
    );
    console.log(`positionRes: ${positionRes}`);

    if (positionRes.answer.length === 0) {
      // If no open positions, get user information
      const userRes = await authAndGetRequest(
        `/api/user/get?login=${login}`,
        type
      );
      console.log(`userRes: ${userRes}`);

      if (userRes && userRes.answer.Balance && userRes.answer.Credit) {
        const balance = Math.abs(parseFloat(userRes.answer.Balance));
        if (balance !== 0) {
          const comment = encodeURIComponent("Negative balance correction");

          // Perform the trade balance operation
          const tradeBalanceRes = await authAndGetRequest(
            `/api/trade/balance?login=${login}&type=${5}&balance=${balance}&comment=${comment}`,
            type
          );
          console.log(`tradeBalanceRes: ${tradeBalanceRes}`);

          const tradeCreditRes = await authAndGetRequest(
            `/api/trade/balance?login=${login}&type=${3}&balance=-${balance}&comment=${comment}`,
            type
          );
          console.log(`tradeCreditRes: ${tradeCreditRes}`);
        } else {
          console.log(`Balance is 0 for login ${login}, skipping.`);
        }
      } else {
        console.log(`No user information found for login ${login}`);
      }
    } else {
      console.log(`Login ${login} has open positions, skipping.`);
    }
  }
  return "true";
};

const batchBalanceCreditZero = async (type) => {
  const group = "real\\standart";
  const res = await authAndGetRequest(
    `/api/user/get_batch?group=${group}`,
    type
  );

  const filteredDatas = res.answer.filter((item) => {
    const balance = parseFloat(item.Balance);
    const credit = parseFloat(item.Credit);

    return balance < 0.0 && credit == 0.0;
  });

  console.log(filteredDatas.length);

  for (const filtered of filteredDatas) {
    // Check if the user has an open position
    const login = filtered.Login;
    if (login.startsWith("100")) {
      console.log(`Login ${login} starts with 100`);
    } else {
      console.log(login);
      // if (login == "514336") {
      const positionRes = await authAndGetRequest(
        `/api/position/get_page?login=${login}&offset=0&total=1`,
        type
      );
      console.log(`positionRes: ${positionRes}`);

      if (positionRes.answer.length === 0) {
        // If no open positions, get user information
        const userRes = await authAndGetRequest(
          `/api/user/get?login=${login}`,
          type
        );
        console.log(`userRes: ${userRes}`);

        if (userRes && userRes.answer.Balance && userRes.answer.Credit) {
          const balance = Math.abs(parseFloat(userRes.answer.Balance));
          if (balance !== 0) {
            const comment = encodeURIComponent("Negative balance correction");

            // Perform the trade balance operation
            const tradeBalanceRes = await authAndGetRequest(
              `/api/trade/balance?login=${login}&type=${5}&balance=${balance}&comment=${comment}`,
              type
            );
            console.log(`tradeBalanceRes: ${tradeBalanceRes}`);
          } else {
            console.log(`Balance is 0 for login ${login}, skipping.`);
          }
        } else {
          console.log(`No user information found for login ${login}`);
        }
      } else {
        console.log(`Login ${login} has open positions, skipping.`);
      }
    }
    // } else {
    //   console.log(`hahahahahahahahahaha`);
    // }
  }
  return "true";
};
// getUser("510085", MT5_SERVER_TYPE.LIVE).then((res) => console.log(res));

// batchBalanceCreditZero(MT5_SERVER_TYPE.LIVE).then((res) => console.log(res));
