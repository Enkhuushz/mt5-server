const { authAndGetRequest } = require("../mt5Service/MT5Request");
const { MT5_SERVER_TYPE } = require("../../lib/constants");
const logger = require("../../config/winston");
const fs = require("fs");
const ExcelJS = require("exceljs");
const { toTimestamp, toTimestampFromDate } = require("../../utils/utils");
const axios = require("axios");

const { generateJson, readFromFileJson } = require("../../utils/file");
const Decimal = require("decimal.js");

// Group Logins List
const getCommissionLogins = async (groups, fromDate, toDate, type) => {
  try {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const skippLogin = [];

    console.log(start);
    console.log(end);

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

        if (!skippLogin.includes(login)) {
          console.log(login);
          skippLogin.push(login);
        }
      }
    }
    generateJson(skippLogin, "loginsThatDidTradeMonth1024");
  } catch (error) {
    console.log(error);
  }
};
const getCommissionDoLogin = async (fromDate, toDate, type) => {
  try {
    readFromFileJson(async (err, jsonData) => {
      const timestampFrom = toTimestamp(fromDate);
      const timestampTo = toTimestamp(toDate);

      const skippLoginJustDeposit = [];
      const skippLoginDeposit = [];

      let index = 0;

      for (const login of jsonData) {
        if (index == 10000) {
          break;
        } else {
          console.log(login);

          const resTotal = await authAndGetRequest(
            `/api/deal/get_total?login=${login}&from=${timestampFrom}&to=${timestampTo}`,
            type
          );

          const totalRecords = resTotal.answer.total;
          console.log(`totalRecords: ${totalRecords}`);

          let is50bonus = false;
          let is50deposit = false;

          let is50depositTime = "";
          let is50Time = "";
          let is50Profit = 0;

          for (let offset = 0; offset < totalRecords; offset += 100) {
            const res = await authAndGetRequest(
              `/api/deal/get_page?login=${login}&from=${timestampFrom}&to=${timestampTo}&offset=${offset}&total=100`,
              type
            );

            for (const record of res.answer) {
              const profit = parseFloat(record.Profit);
              const comment = record.Comment.toLowerCase();
              const dealer = record.Dealer;
              const action = record.Action;

              if (
                profit == 50.0 &&
                dealer == "1007" &&
                action == "3" &&
                !is50bonus
              ) {
                console.log(
                  `profit: ${profit}, dealer: ${dealer}, action: ${action} comment: ${comment}`
                );

                is50bonus = true;
                is50Time = record.TimeMsc;
                is50Profit = profit;
              }

              if (
                profit >= 50.0 &&
                dealer == "1007" &&
                action == "2" &&
                comment.includes("->") &&
                comment.includes(login) &&
                comment.includes("deposit") &&
                !is50deposit
              ) {
                console.log(
                  `profit: ${profit}, dealer: ${dealer}, action: ${action}, comment: ${comment}, time: ${record.TimeMsc}`
                );

                is50deposit = true;
                is50depositTime = record.TimeMsc;
                is50Profit = profit;
              }
            }
          }

          if (is50bonus && is50deposit) {
            const exists = skippLoginDeposit.some(
              (item) => item.login === login
            );

            if (!exists) {
              console.log(
                `is50bonus && is50deposit: ${{
                  login: login,
                  time: is50depositTime,
                }}`
              );
              skippLoginDeposit.push({
                login: login,
                time: is50depositTime,
                bonus50Time: is50Time,
                dateTime: new Date(is50depositTime),
                dateBonus50Time: new Date(is50Time),
                profit: is50Profit,
              });
            }
          } else if (!is50bonus && is50deposit) {
            const exists = skippLoginJustDeposit.some(
              (item) => item.login === login
            );

            if (!exists) {
              console.log(
                `is50bonus && is50deposit: ${{
                  login: login,
                  time: is50depositTime,
                }}`
              );
              skippLoginJustDeposit.push({
                login: login,
                time: is50depositTime,
                bonus50Time: is50Time,
                dateTime: new Date(is50depositTime),
                profit: is50Profit,
              });
            }
          }
        }
      }

      console.log(`===============`);

      console.log(`skippLoginDeposit: ${skippLoginDeposit}`);
      generateJson(skippLoginDeposit, "loginsWhoGot50BonusMonth09");

      console.log(`skippLoginJustDeposit: ${skippLoginJustDeposit}`);
      generateJson(skippLoginJustDeposit, "loginsWhoJustDepositMonth09");
    });
  } catch (error) {
    console.log(error);
  }
};

const calculateCommission30BonusDoLogin = async (fromDate, toDate, type) => {
  try {
    readFromFileJson(async (err, jsonData) => {
      const commissionByLogin = {};
      const timestampFrom = toTimestamp(fromDate);
      const timestampTo = toTimestamp(toDate);

      for (const data of jsonData) {
        const login = data.login;
        const time = data.bonus50Time;

        const resTotal = await authAndGetRequest(
          `/api/deal/get_total?login=${login}&from=${timestampFrom}&to=${timestampTo}`,
          type
        );

        const totalRecords = resTotal.answer.total;
        console.log(`totalRecords: ${totalRecords}`);

        for (let offset = 0; offset < totalRecords; offset += 100) {
          const res = await authAndGetRequest(
            `/api/deal/get_page?login=${login}&from=${timestampFrom}&to=${timestampTo}&offset=${offset}&total=100`,
            type
          );

          for (const record of res.answer) {
            const commission = new Decimal(record.Commission);

            if (time < record.TimeMsc) {
              if (commissionByLogin[login] == undefined) {
                commissionByLogin[login] = new Decimal(0);
              }
              commissionByLogin[login] =
                commissionByLogin[login].add(commission);
            }
          }
        }
      }
      generateJson(commissionByLogin, "commissionByLogin50BonusMonth09");
      console.log(commissionByLogin);
    });
  } catch (error) {
    console.log(error);
  }
};

const calculateCommissionDoLoginNoBonus = async (fromDate, toDate, type) => {
  try {
    readFromFileJson(async (err, jsonData) => {
      const commissionByLogin = {};
      const timestampFrom = toTimestamp(fromDate);
      const timestampTo = toTimestamp(toDate);

      for (const login of jsonData) {
        const resTotal = await authAndGetRequest(
          `/api/deal/get_total?login=${login}&from=${timestampFrom}&to=${timestampTo}`,
          type
        );

        const totalRecords = resTotal.answer.total;
        console.log(`totalRecords: ${totalRecords}`);

        for (let offset = 0; offset < totalRecords; offset += 100) {
          const res = await authAndGetRequest(
            `/api/deal/get_page?login=${login}&from=${timestampFrom}&to=${timestampTo}&offset=${offset}&total=100`,
            type
          );

          for (const record of res.answer) {
            const commission = new Decimal(record.Commission);

            if (commissionByLogin[login] == undefined) {
              commissionByLogin[login] = new Decimal(0);
            }
            commissionByLogin[login] = commissionByLogin[login].add(commission);
          }
        }
      }
      generateJson(commissionByLogin, "commissionsByLoginNoBonus50Month09");
      console.log(commissionByLogin);
    });
  } catch (error) {
    console.log(error);
  }
};

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

const calculateCommissionDoLoginGetEmail = async (path) => {
  try {
    readNumbersFromFile(async (err, jsonData) => {
      const dataArray = [];
      for (const login of jsonData) {
        console.log(login);

        const res = await authAndGetRequest(
          `/api/user/get?login=${login}`,
          MT5_SERVER_TYPE.LIVE
        );

        if (res.retcode === "0 Done") {
          const body = {
            id: login,
            email: res.answer.Email,
          };

          dataArray.push(body);
        } else {
          dataArray.push({ id: login, email: "not found" });
        }
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      // Define the headers for your Excel sheet
      worksheet.columns = [
        { header: "id", key: "id", width: 15 },
        { header: "email", key: "email", width: 15 },
      ];

      // Add the data from the extractedData array to the worksheet
      dataArray.forEach((item) => {
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
    });
  } catch (error) {
    console.log(error);
  }
};

const getUpTraderWithdrawListReport = async (path) => {
  try {
    const dataArray = [];

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const resp = await axios.get(
      "http://localhost:8084/api/withdraw/list/all",
      headers
    );

    for (const data of resp.data) {
      console.log(data);

      dataArray.push({
        id: data?.id,
        amount: data?.amount?.amount,
        email: data?.user?.email,
        login: data?.account?.login,
        created: data?.created,
        paymentMethod: data?.paymentMethodTitle,
      });
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Define the headers for your Excel sheet
    worksheet.columns = [
      { header: "id", key: "id", width: 15 },
      { header: "amount", key: "amount", width: 15 },
      { header: "email", key: "email", width: 15 },
      { header: "login", key: "login", width: 15 },
      { header: "created", key: "created", width: 15 },
      { header: "paymentMethod", key: "paymentMethod", width: 15 },
    ];

    // Add the data from the extractedData array to the worksheet
    dataArray.forEach((item) => {
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
  } catch (error) {
    console.log(error);
  }
};

// getUpTraderWithdrawListReport("uptraderWithdrawListReport").then((res) => {
//   console.log("done");
// });

//1
// getCommissionLogins(
//   "real\\pro",
//   "2023-10-24 00:00:00",
//   "2023-10-24 23:59:59",
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   console.log("getCommissionLogins done");
// });

//2
// getCommissionDoLogin(
//   "2023-10-24 00:00:00",
//   "2023-12-31 23:59:59",
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   console.log("getCommissionDoLogin done");
// });

// calculateCommission30BonusDoLogin(
//   "2023-10-24 00:00:00",
//   "2023-12-31 23:59:59",
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   console.log("calculateCommissionDoLogin 10 month done");
// });

// calculateCommissionDoLoginNoBonus(
//   "2023-10-24 00:00:00",
//   "2023-12-31 23:59:59",
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   console.log("calculateCommissionDoLoginNoBonus 9month done");
// });

// calculateCommissionDoLoginGetEmail(
//   "2023-09-01 00:00:00",
//   "2023-09-30 23:59:59",
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   console.log("res");
// });

module.exports = {
  calculateCommissionDoLoginGetEmail,
};
