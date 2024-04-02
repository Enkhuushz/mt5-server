const { MT5_SERVER_TYPE } = require("../../lib/constants");
const { generateJson } = require("../../utils/file");
const { toTimestamp } = require("../../utils/utils");
const { authAndGetRequest } = require("../mt5Service/MT5Request");
const Decimal = require("decimal.js");
const ExcelJS = require("exceljs");
const axios = require("axios");

const fetch = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Accounts");

    sheet.columns = [
      { header: "login", key: "login" },
      { header: "userid", key: "userid" },
      { header: "group", key: "group" },
    ];

    token = await getToken();

    for (let page = 1; page <= 14; page++) {
      const users = await getUsers(token, page);

      for (const user of users) {
        const accounts = await getUserAccount(user.id);

        for (const account of accounts) {
          if (!account.isDemo) {
            console.log(account);
            sheet.addRow({
              login: account.login,
              userid: user.id,
              group: account.accountTypeTitle,
            });
          }
        }
      }
    }
    const filePath = `file/niju.xlsx`;

    workbook.xlsx
      .writeFile(filePath)
      .then(() => {
        console.log("Excel file saved to", filePath);
      })
      .catch((error) => {
        console.error("Error saving the Excel file:", error);
      });
  } catch (error) {}
};

const getToken = async () => {
  try {
    const url = `http://13.215.227.120:8089/api/uptrader-jwt/token`;

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(url, headers);
    return response.data.message;
  } catch (error) {}
};

const getPartnership = async (token, page) => {
  try {
    token = await getToken();
    const url = `https://portal.motforex.com/api/backoffice/partnership/systems/commissions/?dateRange=2023-07-01_2024-03-01&page=${page}&page_size=100`;

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
    };
    const respone = await axios.get(url, headers);
    return respone.data.results;
  } catch (error) {}
};

const getUsers = async (token, page) => {
  try {
    token = await getToken();
    const url = `https://portal.motforex.com/api/backoffice/user/?page_size=100&page=${page}&partner_account=1352158&status=verified`;

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
    };
    const respone = await axios.get(url, headers);
    return respone.data.results;
  } catch (error) {}
};

const getUserAccount = async (userId) => {
  try {
    token = await getToken();

    const url = `https://portal.motforex.com/api/backoffice/user/${userId}/account/`;

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
    };
    const respone = await axios.get(url, headers);
    return respone.data;
  } catch (error) {}
};
// fetch().then((res) => {
//   console.log("res");
// });

const getPartners = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Accounts");

    sheet.columns = [
      { header: "account", key: "account" },
      { header: "date", key: "date" },
      { header: "name", key: "name" },
      { header: "amount", key: "amount" },
    ];

    token = await getToken();

    for (let page = 1; page <= 6; page++) {
      const users = await getPartnership(token, page);

      for (const user of users) {
        sheet.addRow({
          account: user.account,
          date: user.date,
          name: user.partnerName,
          amount: user.calculatedAmount.amount,
        });
      }
    }
    const filePath = `file/partners.xlsx`;

    workbook.xlsx
      .writeFile(filePath)
      .then(() => {
        console.log("Excel file saved to", filePath);
      })
      .catch((error) => {
        console.error("Error saving the Excel file:", error);
      });
  } catch (error) {}
};

// getPartners().then((res) => {
//   console.log("res");
// });
