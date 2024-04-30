const { MT5_SERVER_TYPE } = require("../../lib/constants");
const { generateJson } = require("../../utils/file");
const { toTimestamp } = require("../../utils/utils");
const { authAndGetRequest } = require("../mt5Service/MT5Request");
const Decimal = require("decimal.js");
const ExcelJS = require("exceljs");
const axios = require("axios");
const fs = require("fs");

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

const getPartners = async (page) => {
  try {
    token = await getToken();
    const url = `https://portal.motforex.com/api/backoffice/partnership/?ordering=-clients&page=${page}&page_size=10`;

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
    };
    const respone = await axios.get(url, headers);
    for (const c of respone.data.results) {
      console.log(c.ibAccounts[0]);
      console.log(c.email);
      console.log(c.firstName);
    }
    return respone.data.results;
  } catch (error) {}
};

const get = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Accounts");

    sheet.columns = [
      { header: "email", key: "email" },
      { header: "ibaccount", key: "ibaccount" },
      { header: "login", key: "login" },
      { header: "userid", key: "userid" },
      { header: "group", key: "group" },
    ];

    const partners = await getPartners(1);

    for (const c of partners) {
      token = await getToken();

      let count = 100;
      console.log(c.ibAccounts[0]);

      for (i = 1; i < count; i++) {
        const users = await getUsers(token, i, c.ibAccounts[0]);

        for (const user of users.results) {
          const accounts = await getUserAccount(token, user.id);

          for (const account of accounts) {
            if (!account.isDemo) {
              console.log(account);

              sheet.addRow({
                email: c.email,
                ibaccount: c.ibAccounts[0],
                login: account.login,
                userid: user.id,
                group: account.accountTypeTitle,
              });
            }
          }
        }
        console.log(users.count);

        if (users.count / 100 < i) {
          break;
        }
      }
      const filePath = `file/${c.firstName}.xlsx`;

      workbook.xlsx
        .writeFile(filePath)
        .then(() => {
          console.log("Excel file saved to", filePath);
        })
        .catch((error) => {
          console.error("Error saving the Excel file:", error);
        });
    }
  } catch (error) {}
};

const getUserAccount = async (token, userId) => {
  try {
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

const getUsers = async (token, page, ibAccount) => {
  try {
    const url = `https://portal.motforex.com/api/backoffice/user/?page_size=100&page=${page}&partner_account=${ibAccount}&status=verified`;

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

// getPartners(1).then((res) => {
//   console.log("res");
// });
