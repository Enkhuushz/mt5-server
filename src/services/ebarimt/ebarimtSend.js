const { authAndGetRequest } = require("../mt5Service/MT5Request");
const { MT5_SERVER_TYPE } = require("../../lib/constants");
const logger = require("../../config/winston");
const fs = require("fs");
const ExcelJS = require("exceljs");
const { toTimestamp, toDatee } = require("../../utils/utils");
const { SkipLogin, CurrencyRate, Receipt } = require("../../model/index");
const { sendReceipt } = require("./ebarimt");
const { sendEmail } = require("../emailService");
const { generateJson } = require("../../utils/file");
const Decimal = require("decimal.js");

const getMultipleDealGroupDateForSkipLogin = async (
  groups,
  fromDate,
  toDate,
  type
) => {
  const timestampFrom = toTimestamp(fromDate);
  const timestampTo = toTimestamp(toDate);

  const res = await authAndGetRequest(
    `/api/deal/get_batch?group=${groups}&from=${timestampFrom}&to=${timestampTo}`,
    type
  );

  const skipLogins = {};

  let index = 0;

  console.log(res.answer.length);

  for (const record of res.answer) {
    const login = record.Login;
    if (record.Dealer === "1007" && record.Profit === "50.00") {
      if (!skipLogins[login]) {
        skipLogins[login] = true;
        const skipLogin = new SkipLogin({ login: login });

        try {
          await skipLogin.save();
          index++;
          console.log(index);
        } catch (error) {
          // Ignore the error if it is a duplicate key error.
          if (error.code === 11000) {
            console.log(`Skipping duplicate login: ${login}`);
          } else {
            // Throw the error if it is not a duplicate key error.
            throw error;
          }
        }
      }
    }
  }
};

const getMultipleDealGroupDateV2 = async (groups, fromDate, toDate, type) => {
  const foundSkipLogins = await SkipLogin.find();

  const testEmailEbarimt = process.env.TEST_LOGIN_EBARIMT;

  console.log(foundSkipLogins.length);

  // const jsonDatafoundSkipLogins = JSON.stringify(foundSkipLogins, null, 2);

  // Write the JSON data to a file.
  // fs.writeFile(
  //   "filev2/outputDealV2OutputsfoundSkipLogins.json",
  //   jsonDatafoundSkipLogins,
  //   (err) => {
  //     if (err) {
  //       console.error("Error writing JSON file:", err);
  //     } else {
  //       console.log(
  //         "Filtered JSON data saved to",
  //         "file/outputDealV2OutputsfoundSkipLogins.json"
  //       );
  //     }
  //   }
  // );

  const timestampFrom = toTimestamp(fromDate);
  const timestampTo = toTimestamp(toDate);

  const res = await authAndGetRequest(
    `/api/deal/get_batch?group=${groups}&from=${timestampFrom}&to=${timestampTo}`,
    type
  );

  // const jsonDataResultDeal = JSON.stringify(res.answer, null, 2);

  // Write the JSON data to a file.
  // fs.writeFile(
  //   "filev2/outputDealV2OutputsResultDeal.json",
  //   jsonDataResultDeal,
  //   (err) => {
  //     if (err) {
  //       console.error("Error writing JSON file:", err);
  //     } else {
  //       console.log(
  //         "Filtered JSON data saved to",
  //         "file/outputDealV2OutputsResultDeal.json"
  //       );
  //     }
  //   }
  // );

  const uniqueLogins = new Set();

  const commissionByLogin = {};

  const skippLogin = [];

  console.log(res.answer.length);

  for (const record of res.answer) {
    const login = record.Login;
    const commission = parseFloat(record.Commission);

    const isFoundSkipLogin = foundSkipLogins.some(
      (skipLogin) => skipLogin.login === login
    );

    if (!isFoundSkipLogin) {
      if (!uniqueLogins.has(login)) {
        uniqueLogins.add(login);
      }

      if (commissionByLogin[login] == undefined) {
        commissionByLogin[login] = 0;
      }
      commissionByLogin[login] += commission;
    } else {
      if (!skippLogin.includes(login)) {
        skippLogin.push(login);
      }
    }
  }

  // const jsonDataSkipLogin = JSON.stringify(skippLogin, null, 2);

  // // Write the JSON data to a file.
  // fs.writeFile(
  //   "filev2/outputDealV2OutputsSkipLogin.json",
  //   jsonDataSkipLogin,
  //   (err) => {
  //     if (err) {
  //       console.error("Error writing JSON file:", err);
  //     } else {
  //       console.log(
  //         "Filtered JSON data saved to",
  //         "file/outputDealV2OutputsSkipLogin.json"
  //       );
  //     }
  //   }
  // );

  const filteredResults = [];

  console.log(uniqueLogins.size);

  let index = 0;
  for (const login of uniqueLogins) {
    if (index == 1) {
      break;
    }
    const response = await authAndGetRequest(
      `/api/user/get?login=${login}`,
      type
    );

    if (commissionByLogin[login] !== 0) {
      const email = response.answer.Email;

      const body = {
        login,
        commission: commissionByLogin[login].toFixed(2),
        email,
      };
      console.log(body);

      const foundCurrencyRate = await CurrencyRate.findOne({
        date: "2023-10-29",
      });

      console.log(foundCurrencyRate);

      const mntCommission =
        Math.abs(parseFloat(body.commission)) * foundCurrencyRate.rate;

      console.log(mntCommission.toFixed(2));

      const receipt = await sendReceipt(
        mntCommission.toFixed(2),
        "enkhbayar.e@motforex.com"
      );
      console.log(receipt);

      await sendEmail(
        mntCommission.toFixed(2),
        receipt.lottery,
        receipt.id,
        receipt.qrData,
        receipt.date,
        login,
        "enkhbayar.e@motforex.com",
        fromDate,
        toDate
      );

      filteredResults.push(body);
      index++;
      console.log(index);
    }
  }

  // const jsonData = JSON.stringify(filteredResults, null, 2);

  // Write the JSON data to a file.
  // fs.writeFile("filev2/outputDealV2Outputs112.json", jsonData, (err) => {
  //   if (err) {
  //     console.error("Error writing JSON file:", err);
  //   } else {
  //     console.log("Filtered JSON data saved to", "file/outputDeal1.json");
  //   }

  //   //Excel
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Data");

  //   // Define the headers for your Excel sheet
  //   worksheet.columns = [
  //     { header: "Login", key: "Login", width: 15 },
  //     { header: "Email", key: "Email", width: 15 },
  //   ];

  //   // Add the data from the extractedData array to the worksheet
  //   filteredResults.forEach((item) => {
  //     worksheet.addRow(item);
  //   });

  //   // Define the file path where you want to save the Excel file
  //   const filePath = "filev2/outputDealV2Outputs112.xlsx";

  //   // Save the Excel workbook to the file
  //   workbook.xlsx
  //     .writeFile(filePath)
  //     .then(() => {
  //       console.log("Excel file saved to", filePath);
  //     })
  //     .catch((error) => {
  //       console.error("Error saving the Excel file:", error);
  //     });
  // });
  return "res";
};

const getMultipleDealGroupDateV2Test = async (
  groups,
  logins,
  fromDate,
  toDate,
  type
) => {
  try {
    const timestampFrom = toTimestamp(fromDate);
    const timestampTo = toTimestamp(toDate);

    const resTotal = await authAndGetRequest(
      `/api/deal/get_total?login=${logins}&from=${timestampFrom}&to=${timestampTo}`,
      type
    );

    console.log(resTotal);

    const totalRecords = resTotal.answer.total;

    generateJson(resTotal.answer, "outPutResTotal");

    const uniqueLogins = new Set();

    const commissionByLogin = {};

    for (let offset = 0; offset < totalRecords; offset += 100) {
      const res = await authAndGetRequest(
        `/api/deal/get_page?login=${logins}&from=${timestampFrom}&to=${timestampTo}&offset=${offset}&total=100`,
        type
      );

      console.log(res.answer.length);

      for (const record of res.answer) {
        const login = record.Login;
        const commission = parseFloat(record.Commission);
        if (!uniqueLogins.has(login)) {
          uniqueLogins.add(login);
        }

        commissionByLogin[login] = commissionByLogin[login] ?? 0;
        commissionByLogin[login] += commission;
      }
      generateJson(
        { answer: res.answer, commission: commissionByLogin },
        `outPutRes${logins}${offset}`
      );
    }
    const filteredResults = [];

    console.log(commissionByLogin);

    let index = 0;
    for (const login of uniqueLogins) {
      const response = await authAndGetRequest(
        `/api/user/get?login=${login}`,
        type
      );

      if (commissionByLogin[login] !== 0) {
        const email = response.answer.Email;
        const commission = new Decimal(record.Commission);

        const body = {
          login,
          commission: commission,
          email: "e.enkhbayat@gmail.com",
        };
        console.log(body);

        const foundCurrencyRate = await CurrencyRate.findOne({
          date: "2023-10-29",
        });

        console.log(foundCurrencyRate);

        const mntCommission =
          Math.abs(parseFloat(body.commission)) * foundCurrencyRate.rate;

        console.log(mntCommission.toFixed(2));

        const receipt = await sendReceipt(mntCommission.toFixed(2), email);
        console.log(receipt);

        await sendEmail(
          mntCommission.toFixed(2),
          receipt.lottery,
          receipt.id,
          receipt.qrData,
          receipt.date,
          login,
          "e.enkhbayat@gmail.com",
          fromDate.split(" ")[0],
          toDate.split(" ")[0],
          "арилжааны шимтгэл"
        );

        filteredResults.push(body);
        index++;
        console.log(index);
      }
    }
    console.log(filteredResults);
    return "res";
  } catch (error) {
    console.log(error);
  }
};

const getMultipleDealGroupDate = async (groups, fromDate, toDate, type) => {
  const foundSkipLogins = await SkipLogin.find();

  const timestampFrom = toTimestamp(fromDate);
  const timestampTo = toTimestamp(toDate);

  const res = await authAndGetRequest(
    `/api/deal/get_batch?group=${groups}&from=${timestampFrom}&to=${timestampTo}`,
    type
  );

  const uniqueLogins = new Set();

  const commissionByLogin = {};

  const skipLogins = {};

  for (const record of res.answer) {
    const login = record.Login;
    if (record.Dealer === "1007" && record.Profit === "50.00") {
      skipLogins[login] = true;
    }
  }

  for (const record of res.answer) {
    const login = record.Login;
    const commission = parseFloat(record.Commission);

    if (skipLogins[login]) {
      continue;
    } else {
      if (!uniqueLogins.has(login)) {
        uniqueLogins.add(login);
      }
      if (commissionByLogin[login] == undefined) {
        commissionByLogin[login] = 0;
      }
      commissionByLogin[login] += commission;
    }
  }

  const jsonDataa = JSON.stringify(uniqueLogins, null, 2);

  // Write the JSON data to a file.
  fs.writeFile("file/outputDeal131.json", jsonDataa, (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log("Filtered JSON data saved to", "file/outputDeal1.json");
    }
  });

  console.log(uniqueLogins.size);

  const filteredResults = [];

  let index = 0;
  for (const login of uniqueLogins) {
    if (index == 10) {
      break;
    }
    const response = await authAndGetRequest(
      `/api/user/get?login=${login}`,
      type
    );
    const email = response.answer.Email;

    console.log(commissionByLogin[login]);

    if (commissionByLogin[login] !== 0) {
      filteredResults.push({
        login,
        commission: commissionByLogin[login],
        email,
      });
      index++;
      console.log(index);
    }
  }

  const jsonData = JSON.stringify(filteredResults, null, 2);

  // Write the JSON data to a file.
  // fs.writeFile("file/outputDeal13.json", jsonData, (err) => {
  //   if (err) {
  //     console.error("Error writing JSON file:", err);
  //   } else {
  //     console.log("Filtered JSON data saved to", "file/outputDeal1.json");
  //   }

  //   //Excel
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Data");

  //   // Define the headers for your Excel sheet
  //   worksheet.columns = [
  //     { header: "Login", key: "Login", width: 15 },
  //     { header: "Email", key: "Email", width: 15 },
  //   ];

  //   // Add the data from the extractedData array to the worksheet
  //   filteredResults.forEach((item) => {
  //     worksheet.addRow(item);
  //   });

  //   // Define the file path where you want to save the Excel file
  //   const filePath = "file/outputDeal13.xlsx";

  //   // Save the Excel workbook to the file
  //   workbook.xlsx
  //     .writeFile(filePath)
  //     .then(() => {
  //       console.log("Excel file saved to", filePath);
  //     })
  //     .catch((error) => {
  //       console.error("Error saving the Excel file:", error);
  //     });
  // });
  return "res";
};

module.exports = {
  getMultipleDealGroupDateForSkipLogin,
  getMultipleDealGroupDateV2,
  getMultipleDealGroupDateV2Test,
  getMultipleDealGroupDate,
};
