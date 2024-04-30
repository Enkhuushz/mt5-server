const { MT5_SERVER_TYPE } = require("../../lib/constants");
const { generateJson } = require("../../utils/file");
const { toTimestamp } = require("../../utils/utils");
const { authAndGetRequest } = require("../mt5Service/MT5Request");
const Decimal = require("decimal.js");
const ExcelJS = require("exceljs");
const axios = require("axios");
const fs = require("fs");

function readNumbersFromFile(callback) {
  const filePath = "file/login.txt";

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

const getDeals = async (path, fromDate, toDate, type) => {
  try {
    readNumbersFromFile(async (err, jsonData) => {
      let list = [];

      for (const login of jsonData) {
        if (login.length === 6) {
          const resp = await getDate(login, fromDate, toDate, type);

          list = list.concat(resp);
        }
      }

      console.log(list);
      generateExcell(list, `${path}`);
    });
  } catch (error) {}
};

const getDate = async (login, fromDate, toDate, type) => {
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
    let returnResults = [];

    for (let offset = 0; offset < totalRecords; offset += 100) {
      const resDeal = await authAndGetRequest(
        `/api/deal/get_page?login=${login}&from=${timestampFrom}&to=${timestampTo}&offset=${offset}&total=100`,
        type
      );
      results = results.concat(resDeal.answer);
    }

    for (const deal of results) {
      const timestamp = parseInt(deal.Time, 10) * 1000;

      let dayKey;
      let date;

      if (timestamp < 1702770513000) {
        date = new Date(timestamp);
      } else {
        date = new Date(timestamp - 6 * 60 * 60 * 1000);
      }

      dayKey = date.toISOString();

      returnResults.push({
        deal: deal.Deal,
        date: dayKey,
        login: deal.Login,
        action: deal.Action,
        entry: deal.Entry,
        symbol: deal.Symbol,
        price: deal.Price,
        priceGateway: deal.PriceGateway,
        volume: deal.Volume,
        profit: deal.Profit,
        commission: deal.Commission,
        swap: deal.Storage,
        comment: deal.Comment,
      });
    }

    return returnResults;
  } catch (error) {
    console.log(error);
  }
};

function generateExcell(list, path) {
  try {
    //  Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.columns = [
      { header: "deal", key: "deal", width: 15 },
      { header: "date", key: "date", width: 15 },
      { header: "login", key: "login", width: 15 },
      { header: "action", key: "action", width: 15 },
      { header: "entry", key: "entry", width: 15 },

      { header: "symbol", key: "symbol", width: 15 },
      { header: "price", key: "price", width: 15 },
      { header: "priceGateway", key: "priceGateway", width: 15 },

      { header: "volume", key: "volume", width: 15 },
      { header: "profit", key: "profit", width: 15 },
      { header: "commission", key: "commission", width: 15 },
      { header: "swap", key: "swap", width: 15 },
      { header: "comment", key: "comment", width: 15 },
    ];
    const validItems = list.filter(
      (item) =>
        item &&
        Object.keys(item).length > 0 &&
        Object.values(item).some((value) => value !== null && value !== "")
    );

    validItems.forEach((item) => {
      worksheet.addRow(item);
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

getDeals(
  "niju",
  "2024-04-22 06:00:00",
  "2024-04-28 06:00:00",
  MT5_SERVER_TYPE.LIVE
).then((res) => {
  console.log("res");
});
