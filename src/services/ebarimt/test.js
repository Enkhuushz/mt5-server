const { authAndGetRequest } = require("../mt5Service/MT5Request");
const { MT5_SERVER_TYPE } = require("../../lib/constants");
const logger = require("../../config/winston");
const fs = require("fs");
const ExcelJS = require("exceljs");
const {
  toTimestamp,
  toDatee,
  toTimestampFromDate,
} = require("../../utils/utils");

const {
  generateJson,
  readFromTextToList,
  readFromFileJson,
} = require("../../utils/file");
const Decimal = require("decimal.js");

const getCommissionLogins = async (groups, fromDate, toDate, type) => {
  try {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const skippLogin = [];

    for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
      const timestampFrom = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        0,
        0,
        0
      );
      const timestampTo = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        23,
        59,
        59
      );
      const res = await authAndGetRequest(
        `/api/deal/get_batch?group=${groups}&from=${toTimestampFromDate(
          timestampFrom
        )}&to=${toTimestampFromDate(timestampTo)}`,
        type
      );

      for (const record of res.answer) {
        const login = record.Login;

        console.log(login);

        if (!skippLogin.includes(login)) {
          skippLogin.push(login);
        }
      }
    }
    console.log(skippLogin);
    generateJson(skippLogin, "loginsThatDidTradeMonth10FirstHalf");
  } catch (error) {
    console.log(error);
  }
};

getCommissionLogins(
  "real\\pro",
  "2023-10-01 00:00:00",
  "2023-10-31 23:59:59",
  MT5_SERVER_TYPE.LIVE
).then((res) => {
  console.log("getCommissionLogins done");
});
