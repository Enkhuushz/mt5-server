const { MT5_SERVER_TYPE } = require("../../lib/constants");
const { generateJson } = require("../../utils/file");
const { toTimestamp } = require("../../utils/utils");
const { authAndGetRequest } = require("../mt5Service/MT5Request");
const Decimal = require("decimal.js");
const ExcelJS = require("exceljs");
const axios = require("axios");
const fs = require("fs");

const getFundFailedUsers = async (groups, fromDate, toDate, type) => {
  try {
    let list = [];

    const res = await authAndGetRequest(
      `/api/user/get_batch?group=${groups}`,
      type
    );
    let count = 0;
    for (const user of res.answer) {
      if (count == 5) {
        break;
      }
      const login = user.Login;

      const resp = await getFailedDate(login, fromDate, toDate, type);

      list = list.concat(resp);
      count++;
    }
    console.log(list);
    generateExcell(list, `failedUserData`);
  } catch (error) {}
};

const getFailedDate = async (login, fromDate, toDate, type) => {
  try {
    console.log(`login: ${login}`);

    const timestampFrom = toTimestamp(fromDate);
    const timestampTo = toTimestamp(toDate);

    const resTotal = await authAndGetRequest(
      `/api/deal/get_total?login=${login}&from=${timestampFrom}&to=${timestampTo}`,
      type
    );
    const totalRecords = resTotal.answer.total;

    let results = [];

    for (let offset = 0; offset < totalRecords; offset += 100) {
      const resDeal = await authAndGetRequest(
        `/api/deal/get_page?login=${login}&from=${timestampFrom}&to=${timestampTo}&offset=${offset}&total=100`,
        type
      );
      results = results.concat(resDeal.answer);
    }

    if (results.length > 0) {
      const profit = results[0].Profit;
      const timestamp = parseInt(results[results.length - 1].Time, 10) * 1000;

      let dayKey;
      let date;

      if (timestamp < 1702770513000) {
        date = new Date(timestamp);
      } else {
        date = new Date(timestamp - 6 * 60 * 60 * 1000);
      }

      dayKey = date.toISOString();

      body = { date: dayKey, login: login, amount: profit };
      console.log(body);

      return body;
    } else {
      body = { date: "no", login: "no", amount: "no" };

      return body;
    }
  } catch (error) {
    console.log(error);
  }
};

function generateExcell(endOfDayBalances, path) {
  try {
    //  Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.columns = [
      { header: "date", key: "date", width: 15 },
      { header: "login", key: "login", width: 15 },
      { header: "amount", key: "amount", width: 15 },
    ];

    endOfDayBalances.forEach((item) => {
      if (item.login != "no") {
        worksheet.addRow(item);
      }
    });

    // Define the file path where you want to save the Excel file
    const filePath = `file/${path}.xlsx`;

    // Save the Excel workbook to the file
    workbook.xlsx
      .writeFile(filePath)
      .then(() => {
        console.log("Excel file saved to", filePath);
      })
      .catch((error) => {
        console.error("Error saving the Excel file:", error);
      });
    return "resTotal";
  } catch (error) {
    console.log(error);
  }
}

// getFundFailedUsers(
//   "demo\\failed",
//   "2023-07-01 00:00:00",
//   "2024-02-10 23:59:59",
//   MT5_SERVER_TYPE.DEMO
// ).then((res) => {
//   console.log("done");
// });

module.exports = {
  getFundFailedUsers,
};
