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
  } catch (error) {
    console.log(error);
  }
};

const getUserByLogin = async (login, token) => {
  try {
    const url = `https://portal.motforex.com/api/backoffice/user/?page_size=200&document_status=verified&page=1&search=${login}&status=verified`;

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
    };
    const response = await axios.get(url, headers);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getUsersAllAccount = async (userId, token) => {
  try {
    const url = `https://portal.motforex.com/api/backoffice/user/${userId}/account/`;

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
    };
    const response = await axios.get(url, headers);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const archiveAccount = async (userId, loginId, token) => {
  try {
    const url = `https://portal.motforex.com/api/backoffice/user/${userId}/account/${loginId}/archive/`;

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
    };
    const response = await axios.post(url, headers);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const archive = async () => {
  try {
    console.log("start");
    readNumbersFromFile(async (err, jsonData) => {
      console.log(jsonData);
      const token = await getToken();

      for (login of jsonData) {
        const user = await getUserByLogin(login, token);
        console.log(user);
      }
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

// archive().then((res) => {
//   console.log("done");
// });
