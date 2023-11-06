const {
  authAndGetRequest,
  authAndPostRequest,
} = require("../../mt5Service/MT5Request");
const { MT5_SERVER_TYPE } = require("../../../lib/constants");
const logger = require("../../../config/winston");
const fs = require("fs");
const ExcelJS = require("exceljs");
const { toTimestamp, toDatee } = require("../../../utils/utils");
const { SkipLogin, CurrencyRate, Receipt } = require("../../../model/index");
const { sendReceipt } = require("../../ebarimt");
const { sendEmail } = require("../../emailService");
const { generateJson } = require("../../../utils/file");

const getTotalDeal = async (login, fromDate, toDate, type) => {
  const timestampFrom = toTimestamp(fromDate);
  const timestampTo = toTimestamp(toDate);

  const res = await authAndGetRequest(
    `/api/deal/get_total?login=${login}&from=${timestampFrom}&to=${timestampTo}`,
    type
  );
  return res;
};

// 13 Get Deal by login date and index
const getDealByPage = async (login, fromDate, toDate, index, number, type) => {
  const timestampFrom = toTimestamp(fromDate);
  const timestampTo = toTimestamp(toDate);

  const res = await authAndGetRequest(
    `/api/deal/get_page?login=${login}&from=${timestampFrom}&to=${timestampTo}&offset=${index}&total=${number}`,
    type
  );
  return res;
};

// 13 Get Deal by login only Date
const getDealByPageOnlyDate = async (login, fromDate, toDate, type) => {
  const timestampFrom = toTimestamp(fromDate);
  const timestampTo = toTimestamp(toDate);

  const res = await authAndGetRequest(
    `/api/deal/get_page?login=${login}&from=${timestampFrom}&to=${timestampTo}`,
    type
  );
  return res;
};

// 13 Get Deal by login only index
const getDealByPageNoDate = async (login, index, number, type) => {
  const res = await authAndGetRequest(
    `/api/deal/get_page?login=${login}&offset=${index}&total=${number}`,
    type
  );
  return res;
};

// 13 Get Deal by group
const getMultipleDealGroup = async (groups, fromDate, toDate, type) => {
  const timestampFrom = toTimestamp(fromDate);
  const timestampTo = toTimestamp(toDate);

  const res = await authAndGetRequest(
    `/api/deal/get_batch?group=${groups}&from=${timestampFrom}&to=${timestampTo}`,
    type
  );
  return res;
};

// 14 Арилжааны түүх засах
const updateDeal = async (deal, externalId, login, priceTp, type) => {
  const res = await authAndPostRequest(
    `/api/deal/update`,
    {
      Deal: deal,
      ExternalID: externalId,
      Login: login,
      PriceTP: priceTp,
    },
    type
  );
  return res;
};

// 15 Арилжааны түүх устгах
const deleteDeal = async (tickets, type) => {
  const res = await authAndGetRequest(
    `/api/deal/delete?ticket=${tickets}`,
    type
  );
  return res;
};

const getDealByTicket = async (ticket, type) => {
  const res = await authAndGetRequest(`/api/deal/get?ticket=${ticket}`, type);
  return res;
};
// getTotalDeal("516892", "2023-10-01", "2023-10-30", MT5_SERVER_TYPE.LIVE).then(
//   (res) => {
//     console.log(res);
//   }
// );

// getDealByPageOnlyDate(
//   "516892",
//   "2023-10-24 00:00:00",
//   "2023-10-24 23:59:59",
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   console.log(res);
// });

// getDealByPage(
//   "519049",
//   "2023-10-24 00:00:00",
//   "2023-10-24 23:59:59",
//   0,
//   100,
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   let sum = 0;

//   console.log(res.answer.length);

//   const filteredDatas = res.answer.filter((item) => {
//     const parsedCommission = parseFloat(item.Commission);

//     if (parsedCommission != 0.0) {
//       sum = sum + parsedCommission;
//     }

//     return parsedCommission != 0.0;
//   });

//   console.log(`sum: ${sum}`);

//   const jsonData = JSON.stringify(filteredDatas, null, 2);

//   // Write the JSON data to a file.
//   fs.writeFile("file/output190.json", jsonData, (err) => {
//     if (err) {
//       console.error("Error writing JSON file:", err);
//     } else {
//       console.log("Filtered JSON data saved to", "file/output62.json");
//     }
//   });
// });

// getDealByPageNoDate("516892", 0, 100, MT5_SERVER_TYPE.LIVE).then((res) => {
//   console.log(res);
// });

// getDealByPageNoDate("100099", 0, 100, MT5_SERVER_TYPE.LIVE).then((res) => {
//   console.log("res");
// });

// getDealByPageNoDate("519049", 0, 100, MT5_SERVER_TYPE.LIVE).then((res) => {
//   res.answer.map((item) => {
//     console.log(item.TimeMsc);
//     const dateObj = new Date(parseInt(item.TimeMsc));
//     console.log(dateObj);
//   });

//   const jsonData = JSON.stringify(res, null, 2);

//   // Write the JSON data to a file.
//   fs.writeFile("file/output1888.json", jsonData, (err) => {
//     if (err) {
//       console.error("Error writing JSON file:", err);
//     } else {
//       console.log("Filtered JSON data saved to", "file/output62.json");
//     }
//   });
// });

// getDealByPageNoDate("511222", 0, 100, MT5_SERVER_TYPE.LIVE).then((res) => {
//   const timestamp = 1697816349694;
//   const date = new Date(timestamp);

//   const gmt8Offset = 8 * 60 * 60 * 1000; // in milliseconds
//   console.log(date);
//   date.setHours(date.getHours() + gmt8Offset);

//   const formattedDate = date.toLocaleDateString("en-US");
//   console.log(date);
//   console.log(formattedDate);

//   const jsonData = JSON.stringify(res, null, 2);

//   // Write the JSON data to a file.
//   fs.writeFile("file/output67.json", jsonData, (err) => {
//     if (err) {
//       console.error("Error writing JSON file:", err);
//     } else {
//       console.log("Filtered JSON data saved to", "file/output62.json");
//     }
//   });
// });

// getDealByPageNoDate("903572", 0, 100, MT5_SERVER_TYPE.DEMO).then((res) => {
//   const timestamp = 1698074813328;
//   const date = new Date(timestamp);
//   console.log(date);

//   const timestampStart = 1697990400000;
//   const eneTimeStamp = 1698076799999;

//   const sdate = new Date(timestampStart);
//   const edate = new Date(eneTimeStamp);
//   console.log(sdate);
//   console.log(edate);

//   // const startDate = moment().startOf("day");
//   // const endDate = moment().endOf("day");

//   // const startTimestamp = startDate.valueOf();
//   // const endTimestamp = endDate.valueOf();

//   // console.log(startTimestamp); // 1698074813328
//   // console.log(endTimestamp);

//   const jsonData = JSON.stringify(res, null, 2);

//   // Write the JSON data to a file.
//   fs.writeFile("file/output68.json", jsonData, (err) => {
//     if (err) {
//       console.error("Error writing JSON file:", err);
//     } else {
//       console.log("Filtered JSON data saved to", "file/output62.json");
//     }
//   });
// });

const getMultipleDeal = async (
  logins,
  groups,
  tickets,
  fromDate,
  toDate,
  symbol,
  type
) => {
  const res = await authAndGetRequest(
    `/api/deal/get_batch?login=${logins}&group=${groups}&ticket=${tickets}&from=${fromDate}&to=${toDate}&symbol=${symbol}`,
    type
  );
  return res;
};

// getMultipleDealGroup(
//   "real\\pro",
//   "2023-10-10 00:00:00",
//   "2023-10-10 23:59:59",
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   console.log(res);
// });

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

// getMultipleDealGroupDateForSkipLogin(
//   "real\\pro",
//   "2023-10-26 00:00:00",
//   "2023-10-26 23:59:59",
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   console.log(res);
// });

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

        const receipt = await sendReceipt(mntCommission.toFixed(2), email);
        console.log(receipt);

        await sendEmail(
          mntCommission.toFixed(2),
          receipt.lottery,
          receipt.id,
          receipt.qrData,
          receipt.date,
          login,
          email,
          fromDate.split(" ")[0],
          toDate.split(" ")[0]
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

// getMultipleDealGroupDateV2(
//   "real\\pro",
//   "2023-10-24 00:00:00",
//   "2023-10-24 23:59:59",
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   console.log(res);
// });

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

// getMultipleDealGroupDate(
//   "real\\pro",
//   "2023-10-24 00:00:00",
//   "2023-10-24 23:59:59",
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   console.log(res);
// });

// updateDeal(
//   "189203",
//   "194F94F659A817A1",
//   "903572",
//   "149.850",
//   MT5_SERVER_TYPE.DEMO
// ).then((res) => {
//   console.log(res);
// });

// deleteDeal("189202", MT5_SERVER_TYPE.DEMO).then((res) => {
//   console.log(res);
// });

module.exports = {
  getTotalDeal,
  getDealByPage,
  getDealByPageOnlyDate,
  getDealByPageNoDate,
  getMultipleDealGroup,
  updateDeal,
  deleteDeal,
  getMultipleDeal,
  getMultipleDealGroupDateForSkipLogin,
  getMultipleDealGroupDateV2,
  getMultipleDealGroupDateV2Test,
  getMultipleDealGroupDate,
  getDealByTicket,
};
