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

const getEndOfDay = async (groups, from, to, type) => {
  try {
    readNumbersFromFile(async (err, jsonData) => {
      const resLoginList = await authAndGetRequest(
        `/api/user/logins?group=${groups}`,
        type
      );

      // const resLoginList = {
      //   answer: ["512988"],
      // };

      console.log(resLoginList);

      let list = [];

      let index = 0;

      const length = resLoginList.answer.length;

      for (let i = 0; i < length; i += 500) {
        const loginList = resLoginList.answer.slice(i, i + 500);
        let token;
        console.log(loginList);

        for (let j = 0; j < loginList.length; j++) {
          const login = loginList[j];
          console.log(login);

          //token crm
          if (j % 50 == 0) {
            const url = "http://3.1.237.167:8089/api/uptrader-jwt/token";

            const headers = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            token = await axios.get(url, headers);
          }

          const finance = await getFinancial(
            login,
            from,
            to,
            100,
            token,
            jsonData,
            MT5_SERVER_TYPE.LIVE
          );
          index++;
          console.log(index);
          list = list.concat(finance);
        }
        generateExcell(
          list,
          `endOfDayBalancesAll${groups.split("\\")[1]}First${i + 500}`
        );

        setTimeout(() => {
          console.log("Slept for 5 seconds");
        }, 5000);

        list = [];
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const getFinancial = async (
  login,
  fromDate,
  toDate,
  number,
  token,
  jsonData,
  type
) => {
  try {
    const timestampFrom = toTimestamp(fromDate);
    const timestampTo = toTimestamp(toDate);

    const resTotal = await authAndGetRequest(
      `/api/deal/get_total?login=${login}&from=${timestampFrom}&to=${timestampTo}`,
      type
    );
    const resLogin = await authAndGetRequest(
      `/api/user/get?login=${login}`,
      type
    );

    const group = resLogin.answer.Group;
    const email = resLogin.answer.Email;

    const totalRecords = resTotal.answer.total;

    let results = [];

    for (let offset = 0; offset < totalRecords; offset += 100) {
      const resDeal = await authAndGetRequest(
        `/api/deal/get_page?login=${login}&from=${timestampFrom}&to=${timestampTo}&offset=${offset}&total=${number}`,
        type
      );
      results = results.concat(resDeal.answer);
    }

    let withdrawList = [];
    let depositList = [];

    if (jsonData.includes(login)) {
      const hasWalletComment = results.some(
        (e) => (e) => e.Comment && e.Comment.toLowerCase().includes("wallet")
      );

      if (hasWalletComment) {
        const userUrl = `https://portal.motforex.com/api/backoffice/user/?page_size=10&page=1&search=${encodeURIComponent(
          email
        )}`;

        const tokenHeaders = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token.data.message}`,
          },
        };

        const user = await axios.get(userUrl, tokenHeaders);

        const id = user.data.results[0].id;

        const depositUrl = `https://portal.motforex.com/api/backoffice/user/${id}/payments/?page=1&page_size=100&_status=deposited&tab=payments`;
        const withdrawUrl = `https://portal.motforex.com/api/backoffice/user/${id}/payments/?page=1&page_size=10&tab=payments&_status=done`;

        const deposit = await axios.get(depositUrl, tokenHeaders);

        const filterDeposit = deposit.data.results.map((e) => {
          if (e.accountLogin == "wallet") {
            const originalDate = new Date(e.created);
            const modifiedDate = new Date(
              originalDate.getTime() + 8 * 60 * 60 * 1000
            );

            depositList.push({
              login: login,
              amount: new Decimal(e.balanceChangeAmount.amount),
              dateKey: modifiedDate.toISOString().split("T")[0],
              date: modifiedDate,
              type: "deposit",
            });
          }
        });

        console.log(depositList);

        const withdraw = await axios.get(withdrawUrl, tokenHeaders);

        const filterWithdraw = withdraw.data.results.map((e) => {
          if (e.accountLogin == "wallet") {
            const originalDate = new Date(e.created);
            const modifiedDate = new Date(
              originalDate.getTime() + 8 * 60 * 60 * 1000
            );

            withdrawList.push({
              login: login,
              amount: new Decimal(e.balanceChangeAmount.amount),
              dateKey: modifiedDate.toISOString().split("T")[0],
              date: modifiedDate,
              type: "withdraw",
            });
          }
        });
        console.log(withdrawList);
      }
    }

    const endOfDayBalances = calculateEndOfDayBalances(
      results,
      depositList,
      withdrawList,
      group,
      login,
      email
    );
    return endOfDayBalances;
  } catch (error) {
    console.log(error);
  }
};

function calculateEndOfDayBalances(
  resDeal,
  depositList,
  withdrawList,
  group,
  login,
  email
) {
  try {
    const endOfDayBalances = {};

    let eodBalance = new Decimal(0);
    let eodAccountBalance = new Decimal(0);
    let eodCreditBalance = new Decimal(0);
    let eodWalletBalance = new Decimal(0);

    if (withdrawList.length != 0 || depositList.length != 0) {
      resDeal = resDeal.concat(withdrawList, depositList);

      resDeal.sort((a, b) => {
        let timeA;
        let timeB;

        if (a.Time !== undefined) {
          const timestampA = parseInt(a.Time, 10) * 1000;

          if (timestampA < 1702770513000) {
            timeA = new Date(timestampA);
          } else {
            timeA = new Date(timestampA - 6 * 60 * 60 * 1000);
          }
        }
        if (b.Time !== undefined) {
          const timestampB = parseInt(b.Time, 10) * 1000;

          if (timestampB < 1702770513000) {
            timeB = new Date(timestampB);
          } else {
            timeB = new Date(timestampB - 6 * 60 * 60 * 1000);
          }
        }
        if (a.date !== undefined) {
          timeA = a.date;
        }

        if (b.date !== undefined) {
          timeB = b.date;
        }
        return timeA - timeB;
      });
    }

    resDeal.forEach((deal) => {
      if (deal.dateKey) {
        if (deal.type == "deposit") {
          eodWalletBalance = eodWalletBalance.add(deal.amount);

          if (!endOfDayBalances[deal.dateKey]) {
            endOfDayBalances[deal.dateKey] = {
              date: deal.dateKey,
              login: deal.login,
              group: group,
              email: email,

              commission: new Decimal(0),
              swap: new Decimal(0),
              credit: new Decimal(0),
              correction: new Decimal(0),
              balanceAction: new Decimal(0),

              profit: new Decimal(0),
              deposit: new Decimal(0),
              withdraw: new Decimal(0),
              internalDeposit: new Decimal(0),
              internalWithdraw: new Decimal(0),

              internalDepositWallet: new Decimal(0),
              internalWithdrawWallet: new Decimal(0),
              loginWalletDeposit: new Decimal(0),
              loginWalletWithdraw: new Decimal(0),
              externalWalletDeposit: new Decimal(0),
              externalWalletWithdraw: new Decimal(0),

              pnl: new Decimal(0),

              endOfDayBalance: new Decimal(0),
              endOfDayAccountBalance: new Decimal(0),
              endOfDayCreditTotal: new Decimal(0),
              endOfDayWalletTotal: new Decimal(0),
              amount: new Decimal(0),
            };
          }
          endOfDayBalances[deal.dateKey].externalWalletDeposit =
            endOfDayBalances[deal.dateKey].externalWalletDeposit.add(
              deal.amount
            );
          endOfDayBalances[deal.dateKey].endOfDayWalletTotal = eodWalletBalance;
        } else {
          eodWalletBalance = eodWalletBalance.sub(deal.amount);

          if (!endOfDayBalances[deal.dateKey]) {
            endOfDayBalances[deal.dateKey] = {
              date: deal.dateKey,
              login: deal.login,
              group: group,
              email: email,

              commission: new Decimal(0),
              swap: new Decimal(0),
              credit: new Decimal(0),
              correction: new Decimal(0),
              balanceAction: new Decimal(0),

              profit: new Decimal(0),
              deposit: new Decimal(0),
              withdraw: new Decimal(0),
              internalDeposit: new Decimal(0),
              internalWithdraw: new Decimal(0),

              internalDepositWallet: new Decimal(0),
              internalWithdrawWallet: new Decimal(0),
              loginWalletDeposit: new Decimal(0),
              loginWalletWithdraw: new Decimal(0),
              externalWalletDeposit: new Decimal(0),
              externalWalletWithdraw: new Decimal(0),

              pnl: new Decimal(0),

              endOfDayBalance: new Decimal(0),
              endOfDayAccountBalance: new Decimal(0),
              endOfDayCreditTotal: new Decimal(0),
              endOfDayWalletTotal: new Decimal(0),
              amount: new Decimal(0),
            };
          }
          endOfDayBalances[deal.dateKey].externalWalletWithdraw =
            endOfDayBalances[deal.dateKey].externalWalletWithdraw.sub(
              deal.amount
            );
          endOfDayBalances[deal.dateKey].endOfDayWalletTotal = eodWalletBalance;
        }
      } else {
        const timestamp = parseInt(deal.Time, 10) * 1000;
        let dayKey;
        let date;

        if (timestamp < 1702770513000) {
          date = new Date(timestamp);
          dayKey = date.toISOString().split("T")[0];
        } else {
          date = new Date(timestamp - 3 * 60 * 60 * 1000);
          dayKey = date.toISOString().split("T")[0];
        }

        if (!endOfDayBalances[dayKey]) {
          endOfDayBalances[dayKey] = {
            date: dayKey,
            login: login,
            group: group,
            email: email,

            commission: new Decimal(0),
            swap: new Decimal(0),
            credit: new Decimal(0),
            correction: new Decimal(0),
            balanceAction: new Decimal(0),

            profit: new Decimal(0),
            deposit: new Decimal(0),
            withdraw: new Decimal(0),
            internalDeposit: new Decimal(0),
            internalWithdraw: new Decimal(0),

            internalDepositWallet: new Decimal(0),
            internalWithdrawWallet: new Decimal(0),
            loginWalletDeposit: new Decimal(0),
            loginWalletWithdraw: new Decimal(0),
            externalWalletDeposit: new Decimal(0),
            externalWalletWithdraw: new Decimal(0),

            pnl: new Decimal(0),

            endOfDayBalance: new Decimal(0),
            endOfDayAccountBalance: new Decimal(0),
            endOfDayCreditTotal: new Decimal(0),
            endOfDayWalletTotal: new Decimal(0),
            amount: new Decimal(0),
          };
        }

        const action = parseInt(deal.Action, 10);
        const profit = new Decimal(deal.Profit);
        const commission = new Decimal(deal.Commission);
        const swap = new Decimal(deal.Storage);
        const comment = deal.Comment.toLowerCase() || "";

        //Commission
        if (!commission.isZero()) {
          endOfDayBalances[dayKey].commission =
            endOfDayBalances[dayKey].commission.add(commission);
        }

        //Swap
        if (!swap.isZero()) {
          endOfDayBalances[dayKey].swap =
            endOfDayBalances[dayKey].swap.add(swap);
        }

        //End Of Day Equity
        eodAccountBalance = eodAccountBalance.add(profit);
        eodAccountBalance = eodAccountBalance.add(commission);
        eodAccountBalance = eodAccountBalance.add(swap);

        //End Of Day Balance
        if (action == 0 || action == 1 || action == 2 || action == 5) {
          eodBalance = eodBalance.add(profit);
          eodBalance = eodBalance.add(commission);
          eodBalance = eodBalance.add(swap);
        }

        console.log(
          `dayKey = ${dayKey} eodBalance = ${eodBalance}  action = ${action} profit = ${profit} commission = ${commission} comment = ${comment}`
        );

        if (action === 0 || action === 1) {
          //PnL OPERATION
          endOfDayBalances[dayKey].pnl =
            endOfDayBalances[dayKey].pnl.add(profit);
        } else if (action === 2) {
          //Deposit Withdraw Operation
          if (
            comment.includes("deposit") &&
            comment.includes("->") &&
            comment.includes(login) &&
            profit.greaterThan(0)
          ) {
            endOfDayBalances[dayKey].deposit =
              endOfDayBalances[dayKey].deposit.add(profit);
          } else if (
            comment.includes("withdraw") &&
            comment.includes("->") &&
            comment.includes(login) &&
            !profit.greaterThan(0)
          ) {
            endOfDayBalances[dayKey].withdraw =
              endOfDayBalances[dayKey].withdraw.add(profit);
          } else if (
            !comment.includes("wallet") &&
            comment.includes("->") &&
            comment.includes(login)
          ) {
            if (profit.greaterThan(0)) {
              endOfDayBalances[dayKey].internalDeposit =
                endOfDayBalances[dayKey].internalDeposit.add(profit);
            } else {
              endOfDayBalances[dayKey].internalWithdraw =
                endOfDayBalances[dayKey].internalWithdraw.add(profit);
            }
          } else if (
            comment.includes("wallet") &&
            comment.includes("->") &&
            comment.includes(login)
          ) {
            eodWalletBalance = eodWalletBalance.sub(profit);

            if (profit.greaterThan(0)) {
              endOfDayBalances[dayKey].loginWalletDeposit =
                endOfDayBalances[dayKey].loginWalletDeposit.add(profit);

              endOfDayBalances[dayKey].internalWithdrawWallet =
                endOfDayBalances[dayKey].internalWithdrawWallet.sub(profit);
            } else {
              endOfDayBalances[dayKey].loginWalletWithdraw =
                endOfDayBalances[dayKey].loginWalletWithdraw.add(profit);

              endOfDayBalances[dayKey].internalDepositWallet =
                endOfDayBalances[dayKey].internalDepositWallet.sub(profit);
            }
          } else {
            endOfDayBalances[dayKey].balanceAction =
              endOfDayBalances[dayKey].balanceAction.add(profit);
          }
        } else if (action == 3) {
          //Credit operation
          if (!profit.isZero()) {
            endOfDayBalances[dayKey].credit =
              endOfDayBalances[dayKey].credit.add(profit);

            eodCreditBalance = eodCreditBalance.add(profit);
          }
        } else if (action == 5) {
          //Correction operation
          if (!profit.isZero()) {
            endOfDayBalances[dayKey].correction =
              endOfDayBalances[dayKey].correction.add(profit);
          }
        }

        endOfDayBalances[dayKey].endOfDayBalance = eodBalance;
        endOfDayBalances[dayKey].endOfDayAccountBalance = eodAccountBalance;
        endOfDayBalances[dayKey].endOfDayCreditTotal = eodCreditBalance;
        endOfDayBalances[dayKey].endOfDayWalletTotal = eodWalletBalance;
      }
    });

    const endOfDayBalancesArray = Object.values(endOfDayBalances);

    return endOfDayBalancesArray;
  } catch (error) {
    console.log(error);
  }
}

function generateExcell(endOfDayBalances, path) {
  try {
    //  Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.columns = [
      { header: "date", key: "date", width: 15 },
      { header: "login", key: "login", width: 15 },
      { header: "group", key: "group", width: 15 },
      { header: "email", key: "email", width: 15 },

      { header: "commission", key: "commission", width: 15 },
      { header: "swap", key: "swap", width: 15 },
      { header: "credit", key: "credit", width: 15 },
      { header: "balanceAction", key: "balanceAction", width: 15 },

      { header: "deposit", key: "deposit", width: 15 },
      { header: "withdraw", key: "withdraw", width: 15 },
      { header: "correction", key: "correction", width: 15 },
      { header: "internalDeposit", key: "internalDeposit", width: 15 },
      { header: "internalWithdraw", key: "internalWithdraw", width: 15 },

      { header: "loginWalletDeposit", key: "loginWalletDeposit", width: 15 },
      { header: "loginWalletWithdraw", key: "loginWalletWithdraw", width: 15 },
      {
        header: "internalDepositWallet",
        key: "internalDepositWallet",
        width: 15,
      },
      {
        header: "internalWithdrawWallet",
        key: "internalWithdrawWallet",
        width: 15,
      },
      {
        header: "externalWalletDeposit",
        key: "externalWalletDeposit",
        width: 15,
      },
      {
        header: "externalWalletWithdraw",
        key: "externalWalletWithdraw",
        width: 15,
      },

      { header: "pnl", key: "pnl", width: 15 },

      { header: "endOfDayBalance", key: "endOfDayBalance", width: 15 },
      {
        header: "endOfDayAccountBalance",
        key: "endOfDayAccountBalance",
        width: 15,
      },
      {
        header: "endOfDayCreditTotal",
        key: "endOfDayCreditTotal",
        width: 15,
      },
      {
        header: "endOfDayWalletTotal",
        key: "endOfDayWalletTotal",
        width: 15,
      },
    ];

    console.log(`endOfDayBalances.length: ${endOfDayBalances.length}`);

    // Add the data from the extractedData array to the worksheet
    endOfDayBalances.forEach((item) => {
      item.commission = parseFloat(item.commission);
      item.swap = parseFloat(item.swap);
      item.credit = parseFloat(item.credit);

      item.deposit = parseFloat(item.deposit);
      item.withdraw = parseFloat(item.withdraw);
      item.correction = parseFloat(item.correction);
      item.internalDeposit = parseFloat(item.internalDeposit);
      item.internalWithdraw = parseFloat(item.internalWithdraw);
      item.balanceAction = parseFloat(item.balanceAction);

      item.internalDepositWallet = parseFloat(item.internalDepositWallet);
      item.internalWithdrawWallet = parseFloat(item.internalWithdrawWallet);
      item.loginWalletDeposit = parseFloat(item.loginWalletDeposit);
      item.loginWalletWithdraw = parseFloat(item.loginWalletWithdraw);
      item.externalWalletDeposit = parseFloat(item.externalWalletDeposit);
      item.externalWalletWithdraw = parseFloat(item.externalWalletWithdraw);

      item.pnl = parseFloat(item.pnl);

      item.endOfDayBalance = parseFloat(item.endOfDayBalance);
      item.endOfDayAccountBalance = parseFloat(item.endOfDayAccountBalance);
      item.endOfDayCreditTotal = parseFloat(item.endOfDayCreditTotal);
      item.endOfDayWalletTotal = parseFloat(item.endOfDayWalletTotal);
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

module.exports = {
  getEndOfDay,
};
