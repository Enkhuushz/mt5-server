const { MT5_SERVER_TYPE } = require("../../lib/constants");
const { generateJson } = require("../../utils/file");
const { toTimestamp } = require("../../utils/utils");
const { authAndGetRequest } = require("../mt5Service/MT5Request");
const Decimal = require("decimal.js");
const ExcelJS = require("exceljs");

/**
 * Retrieves end of day balance for a given group of users within a specified time range.
 * @param {string} groups - The group of users to retrieve end of day balance for.
 * @param {string} type - The type of authentication to use.
 * @returns {Promise<void>} - A Promise that resolves when the end of day balance has been generated and saved to a file.
 */
const getEndOfDay = async (groups, type) => {
  try {
    const resLoginList = await authAndGetRequest(
      `/api/user/get_batch?group=${groups}`,
      type
    );

    let list = [];

    let index = 0;

    const loginFrom = toTimestamp("2023-09-25 00:00:00");
    const loginTo = toTimestamp("2023-10-01 23:59:59");

    for (const login of resLoginList.answer) {
      console.log(login.Login);
      console.log(
        `login.Registration: ${
          login.Registration
        }, loginFrom: ${loginFrom}, loginTo: ${loginTo} , check: ${
          login.Registration >= loginFrom && login.Registration <= loginTo
        }`
      );

      if (login.Registration >= loginFrom && login.Registration <= loginTo) {
        const finance = await getFinancial(
          login,
          "2023-08-01 00:00:00",
          "2023-11-01 23:59:59",
          100,
          MT5_SERVER_TYPE.LIVE
        );
        index++;
        console.log(index);
        list = list.concat(finance);
      }
    }

    generateExcell(list, `endOfDayBalancesH`);
    generateJson(list, `endOfDayBalancesH`);
  } catch (error) {
    console.log(error);
  }
};

const getFinancial = async (user, fromDate, toDate, number, type) => {
  const timestampFrom = toTimestamp(fromDate);
  const timestampTo = toTimestamp(toDate);

  const login = user.Login;

  const resTotal = await authAndGetRequest(
    `/api/deal/get_total?login=${login}&from=${timestampFrom}&to=${timestampTo}`,
    type
  );

  const group = user.Group;
  const email = user.Email;

  const totalRecords = resTotal.answer.total;

  let results = [];

  for (let offset = 0; offset < totalRecords; offset += 100) {
    const resDeal = await authAndGetRequest(
      `/api/deal/get_page?login=${login}&from=${timestampFrom}&to=${timestampTo}&offset=${offset}&total=${number}`,
      type
    );
    results = results.concat(resDeal.answer);
  }

  const endOfDayBalances = calculateEndOfDayBalances(
    results,
    group,
    login,
    email
  );
  return endOfDayBalances;
};

function calculateEndOfDayBalances(resDeal, group, login, email) {
  const endOfDayBalances = {};

  let eodBalance = new Decimal(0);
  let eodWalletBalance = new Decimal(0);
  let eodAccountBalance = new Decimal(0);

  resDeal.forEach((deal) => {
    const timestamp = parseInt(deal.Time, 10) * 1000;
    const date = new Date(timestamp);
    const dayKey = date.toISOString().split("T")[0];

    if (!endOfDayBalances[dayKey]) {
      endOfDayBalances[dayKey] = {
        date: dayKey,
        login: login,
        group: group,
        email: email,
        profit: new Decimal(0),
        commission: new Decimal(0),
        deposit: new Decimal(0),
        withdraw: new Decimal(0),
        internalDeposit: new Decimal(0),
        internalWithdraw: new Decimal(0),
        pnl: new Decimal(0),
        endOfDayBalance: new Decimal(0),
        endOfDayAccountBalance: new Decimal(0),
        endOfDayWalletBalance: new Decimal(0),
        endOfDayBalanceTotal: new Decimal(0),
        amount: new Decimal(0),
      };
    }

    const action = parseInt(deal.Action, 10);
    const profit = new Decimal(deal.Profit);
    const commission = new Decimal(deal.Commission);
    const comment = deal.Comment.toLowerCase() || "";

    if (!profit.isZero()) {
      endOfDayBalances[dayKey].amount =
        endOfDayBalances[dayKey].amount.add(profit);

      eodBalance = eodBalance.add(profit);

      if (comment.includes("wallet")) {
        if (profit.greaterThan(0)) {
          eodAccountBalance = eodAccountBalance.add(profit);
          eodWalletBalance = eodWalletBalance.sub(profit);
        } else {
          eodAccountBalance = eodAccountBalance.add(profit);
          eodWalletBalance = eodWalletBalance.sub(profit);
        }
      } else {
        eodAccountBalance = eodAccountBalance.add(profit);
      }
    }

    console.log(
      `dayKey = ${dayKey} eodBalance = ${eodBalance}  action = ${action} profit = ${profit} commission = ${commission} comment = ${comment}`
    );

    if (action === 0 || action === 1) {
      endOfDayBalances[dayKey].profit =
        endOfDayBalances[dayKey].profit.add(profit);

      if (!commission.isZero()) {
        endOfDayBalances[dayKey].commission =
          endOfDayBalances[dayKey].commission.add(commission);
      }

      endOfDayBalances[dayKey].pnl = endOfDayBalances[dayKey].profit;
    } else if (action === 2) {
      if (
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
      } else {
        if (profit.lessThan(0)) {
          endOfDayBalances[dayKey].withdraw =
            endOfDayBalances[dayKey].withdraw.add(profit);
        } else if (profit.greaterThan(0)) {
          endOfDayBalances[dayKey].deposit =
            endOfDayBalances[dayKey].deposit.add(profit);
        }
      }
    }
    endOfDayBalances[dayKey].endOfDayBalance = eodBalance;
    endOfDayBalances[dayKey].endOfDayAccountBalance = eodAccountBalance;
    endOfDayBalances[dayKey].endOfDayWalletBalance = eodWalletBalance;
    endOfDayBalances[dayKey].endOfDayBalanceTotal = eodBalance;
  });

  const endOfDayBalancesArray = Object.values(endOfDayBalances);

  return endOfDayBalancesArray;
}

function generateExcell(endOfDayBalances, path) {
  //  Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // Define the headers for your Excel sheet
  worksheet.columns = [
    { header: "date", key: "date", width: 15 },
    { header: "login", key: "login", width: 15 },
    { header: "group", key: "group", width: 15 },
    { header: "email", key: "email", width: 15 },
    { header: "profit", key: "profit", width: 15 },
    { header: "commission", key: "commission", width: 15 },
    { header: "deposit", key: "deposit", width: 15 },
    { header: "withdraw", key: "withdraw", width: 15 },
    { header: "internalDeposit", key: "internalDeposit", width: 15 },
    { header: "internalWithdraw", key: "internalWithdraw", width: 15 },
    { header: "pnl", key: "pnl", width: 15 },
    { header: "endOfDayBalance", key: "endOfDayBalance", width: 15 },
    {
      header: "endOfDayAccountBalance",
      key: "endOfDayAccountBalance",
      width: 15,
    },
    {
      header: "endOfDayWalletBalance",
      key: "endOfDayWalletBalance",
      width: 15,
    },
    { header: "endOfDayBalanceTotal", key: "endOfDayBalanceTotal", width: 15 },
    { header: "amount", key: "amount", width: 15 },
  ];

  // Add the data from the extractedData array to the worksheet
  endOfDayBalances.forEach((item) => {
    item.profit = parseFloat(item.profit);
    item.commission = parseFloat(item.commission);
    item.deposit = parseFloat(item.deposit);
    item.withdraw = parseFloat(item.withdraw);
    item.internalDeposit = parseFloat(item.internalDeposit);
    item.internalWithdraw = parseFloat(item.internalWithdraw);
    item.pnl = parseFloat(item.pnl);
    item.endOfDayBalance = parseFloat(item.endOfDayBalance);
    item.endOfDayAccountBalance = parseFloat(item.endOfDayAccountBalance);
    item.endOfDayWalletBalance = parseFloat(item.endOfDayWalletBalance);
    item.endOfDayBalanceTotal = parseFloat(item.endOfDayBalanceTotal);
    item.amount = parseFloat(item.amount);
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
}

getEndOfDay("real\\xauusd", MT5_SERVER_TYPE.LIVE).then((res) => {
  console.log("res");
});
