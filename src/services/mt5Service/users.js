const { authAndGetRequest, authAndPostRequest } = require("./MT5Request");
const { MT5_SERVER_TYPE } = require("../../lib/constants");
const { log } = require("winston");
const fs = require("fs");
const ExcelJS = require("exceljs");
const { json } = require("sequelize");
const logger = require("../../config/winston");

const getUser = async (login, type) => {
  const res = await authAndGetRequest(`/api/user/get?login=${login}`, type);
  return res;
};

const deposit = async (login, typee, balance, comment, type) => {
  const res = await authAndGetRequest(
    `/api/trade/balance?login=${login}&type=${typee}&balance=${balance}&comment=${comment}`,
    type
  );
  return res;
};

const getBatchUser = async (group, type) => {
  const res = await authAndGetRequest(
    `/api/user/get_batch?group=${group}`,
    type
  );
  return res;
};

const getTotalPositionPage = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/position/get_page?login=${login}&offset=0&total=3`,
    type
  );
  return res;
};

const deletePosition = async (ticket, type) => {
  const res = await authAndGetRequest(
    `/api/position/delete?ticket=${ticket}`,
    type
  );
  return res;
};

const getMultiplePositionPage = async (login, group, type) => {
  const res = await authAndGetRequest(
    `/api/position/get_batch?group=${group}&login=${login}`,
    type
  );
  return res;
};

const getDealByTicket = async (ticket, type) => {
  const res = await authAndGetRequest(`/api/deal/get?ticket=${ticket}`, type);
  return res;
};

const getTotalPosition = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/position/get_total?login=${login}`,
    type
  );
  return res;
};

const updatePosition = async (type) => {
  const res = await authAndPostRequest(
    `/api/position/update`,
    {
      Position: "182823",
      ExternalID: "136AF3DDF6B7FCC7",
      Login: "903572",
      PriceTP: "1.05605",
      PriceSL: "1.05665",
    },
    type
  );
  return res;
};

const chengePasswordUser = async (login, password, type) => {
  const res = await authAndGetRequest(
    `/api/user/change_password?login=${login}&type=main&password=${password}`,
    type
  );
  return res;
};

const getTotal = async (type) => {
  const res = await authAndGetRequest(`/api/user/total`, type);
  return res;
};

const getUserArchive = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/user/archive/get?login=${login}`,
    type
  );
  return res;
};

const getCheckBalance = async (login, flag, type) => {
  const res = await authAndGetRequest(
    `/api/user/check_balance?login=${login}&fixflag=${flag}`,
    type
  );
  return res;
};

const getGroups = async (login, type) => {
  const res = await authAndGetRequest(`/api/user/group?login=${login}`, type);
  return res;
};

const getGroupList = async (group, type) => {
  const res = await authAndGetRequest(`/api/user/logins?group=${group}`, type);
  return res;
};

const deleteUser = async (login, type) => {
  const res = await authAndGetRequest(`/api/user/delete?login=${login}`, type);
  return res;
};

const addUser = async (
  group,
  password,
  nname,
  phone,
  email,
  leverage,
  type
) => {
  const res = await authAndPostRequest(
    `/api/user/add`,
    {
      Group: group,
      Password: password,
      FirstName: "enkhbayar",
      LastName: "enkhorkhon",
      Email: email,
      Phone: phone,
      Leverage: leverage,
    },
    type
  );
  return res;
};

const updateGroupUser = async (login, group, type) => {
  const res = await authAndGetRequest(
    `/api/user/update?login=${login}&group=${group}`,
    type
  );
  return res;
};

const updateLeverageUser = async (login, leverage, type) => {
  const res = await authAndGetRequest(
    `/api/user/update?login=${login}&leverage=${leverage}`,
    type
  );
  return res;
};

const getDailyReports = async (login, type) => {
  const currentDate = new Date();

  // Set the time to the beginning of the day (00:00:00)
  currentDate.setHours(0, 0, 0, 0);

  // Get the timestamp for the start of today (00:00:00)
  const startOfTodayTimestamp = Math.floor(currentDate / 1000); // Convert to seconds

  // Set the time to the end of the day (23:59:59)
  currentDate.setHours(23, 59, 59, 999);

  // Get the timestamp for the end of today (23:59:59)
  const endOfTodayTimestamp = Math.floor(currentDate / 1000); // Convert to seconds

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const yesterdayTimestamp = startOfTodayTimestamp - 86400 - 86400; // 86400 seconds in a day

  const res = await authAndGetRequest(
    `/api/daily_get?from=${yesterdayTimestamp}&to=${endOfTodayTimestamp}&login=${login}`,
    type
  );
  return res;
};

// getDealByTicket("179933", MT5_SERVER_TYPE.DEMO).then((res) => console.log(res));
// getTotalPositionPage("515563", MT5_SERVER_TYPE.LIVE).then((res) =>
//   console.log(res)
// );
// getCheckBalance("903572", "0", MT5_SERVER_TYPE.DEMO).then((res) =>
//   console.log(res)
// );
// getUserArchive("903571", MT5_SERVER_TYPE.DEMO).then((res) => console.log(res));
// getTotal(MT5_SERVER_TYPE.DEMO).then((res) => console.log(res));
// getGroups("903572", MT5_SERVER_TYPE.DEMO).then((res) => console.log(res));

// Данс үүсгэх
// addUser(
//   "demo\\forex-hedge-usd-01",
//   "1Ar#pqkj",
//   "enkhbayar enkhorkhon",
//   "+97695059075",
//   "e.enkhbayat@gmail.com",
//   "200",
//   MT5_SERVER_TYPE.DEMO
// ).then((res) => console.log(res));

//Данс устгах
// deleteUser("903571", MT5_SERVER_TYPE.DEMO).then((res) => console.log(res));

//Данс идэвхгүй болгох

//Дансны мэдээлэл татах /BALANCE, EQUITY, CREDIT, LEVERAGE, USED MARGIN, FREE MARGIN/
// getUser("903572", MT5_SERVER_TYPE.DEMO).then((res) => console.log(res));
function getUsersJson(callback) {
  const filePath = "file/output44.json";

  // Read the JSON file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      callback(err, null); // Call the callback with an error
    } else {
      try {
        const jsonData = JSON.parse(data);
        // Now you can use the jsonData array in your code
        callback(null, jsonData); // Call the callback with the JSON data
      } catch (error) {
        console.error("Error parsing JSON:", error);
        callback(error, null); // Call the callback with an error
      }
    }
  });
}

function getUsersJsonTextFile(callback) {
  const filePath = "file/duplicatedLogins.txt";

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading text file:", err);
      callback(err, null);
    } else {
      const lines = data.trim().split("\n");
      const jsonData = lines.map((line) => ({ Login: line }));
      callback(null, jsonData);
    }
  });
}

const getUsersTextFile = async (type) => {
  getUsersJsonTextFile(async (err, jsonData) => {
    if (err) {
      // Handle the error
      console.error("An error occurred:", err);
    } else {
      for (const user of jsonData) {
        const login = user.Login;
        const positionRes = await authAndGetRequest(
          `/api/position/get_page?login=${login}&offset=0&total=1`,
          type
        );

        if (positionRes.answer.length === 0) {
          const userRes = await authAndGetRequest(
            `/api/user/get?login=${login}`,
            type
          );
          const parsedBalance = parseFloat(userRes.answer.Balance);
          if (parsedBalance == 0.0) {
          } else {
            logger.info(`positionRes: ${JSON.stringify(positionRes)}`);
            logger.info(`userRes: ${JSON.stringify(userRes)}`);
          }
        } else {
          logger.info(`Login ${login} has open positions, skipping.`);
        }
      }
    }
  });
};
// getUser("515653", MT5_SERVER_TYPE.LIVE).then((res) => console.log(res));
// getCheckBalance("515653", 1, MT5_SERVER_TYPE.LIVE).then((res) => {
//   console.log(res);
//   console.log(res.answer.balance);
//   console.log(res.answer.credit);
// });
// getUsersTextFile(MT5_SERVER_TYPE.LIVE).then((res) => {
//   console.log("hahah");
// });

const getDeal = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/deal/get_page?login=${login}&offset=0&total=50`,
    type
  );
  return res;
};

// getDeal("515653", MT5_SERVER_TYPE.LIVE).then((res) => {
//   const timestamp = 1697724741884;
//   const date = new Date(timestamp);

//   const gmt8Offset = 8 * 60 * 60 * 1000; // in milliseconds
//   // date.setHours(date.getHours() + gmt8Offset);

//   const formattedDate = date.toLocaleDateString("en-US");

//   console.log(res);
//   console.log(date);
// });

// getUser("515653", MT5_SERVER_TYPE.LIVE).then((res) => {
//   console.log(res);
// });

const getUsers = async (type) => {
  getUsersJson(async (err, jsonData) => {
    if (err) {
      // Handle the error
      console.error("An error occurred:", err);
    } else {
      for (const user of jsonData) {
        const login = user.Login;
        const balance = Math.abs(parseFloat(user.Balance));
        const credit = parseFloat(user.Credit);

        const positionRes = await authAndGetRequest(
          `/api/position/get_page?login=${login}&offset=0&total=1`,
          type
        );
        logger.info(`positionRes: ${JSON.stringify(positionRes)}`);
        if (positionRes.answer.length === 0) {
          const userRes = await authAndGetRequest(
            `/api/user/get?login=${login}`,
            type
          );
          logger.info(`userRes: ${JSON.stringify(userRes)}`);
          if (balance == userRes.answer.Balance) {
            fs.appendFile(
              "file/duplicatedLogins.txt",
              `Duplicated Login: ${login}\n`,
              (err) => {
                if (err) {
                  console.error("Error appending to file:", err);
                }
              }
            );
          }
        } else {
          logger.info(`Login ${login} has open positions, skipping.`);
        }
        // Use the data as needed in your code
        console.log(`Login: ${login}, Balance: ${balance}, Credit: ${credit}`);
      }
    }
  });
};

const getBatchUserCreditBalanceJsonAndExcel = async (group, type) => {
  const res = await authAndGetRequest(
    `/api/user/get_batch?group=${group}`,
    type
  );
  const filteredData = res.answer.filter((item) => {
    const balance = parseFloat(item.Balance);
    const credit = parseFloat(item.Credit);

    return balance < 0.0 && credit == 0.0;
  });

  const extractedData = [];

  for (const filtered of filteredData) {
    const login = filtered.Login;

    const positionRes = await authAndGetRequest(
      `/api/position/get_page?login=${login}&offset=0&total=1`,
      type
    );
    if (positionRes.answer.length === 0) {
      extractedData.push({
        Login: filtered.Login,
        Group: filtered.Group,
        Name: filtered.Name,
        Balance: filtered.Balance,
        Leverage: filtered.Leverage,
        Credit: filtered.Credit,
      });
    }
  }

  const jsonData = JSON.stringify(extractedData, null, 2);

  // Write the JSON data to a file.
  fs.writeFile("file/output66.json", jsonData, (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log("Filtered JSON data saved to", filePath);
    }
  });

  //Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // Define the headers for your Excel sheet
  worksheet.columns = [
    { header: "Login", key: "Login", width: 15 },
    { header: "Group", key: "Group", width: 15 },
    { header: "Name", key: "Name", width: 30 },
    { header: "Balance", key: "Balance", width: 15 },
    { header: "Leverage", key: "Leverage", width: 15 },
    { header: "Credit", key: "Credit", width: 15 },
  ];

  // Add the data from the extractedData array to the worksheet
  extractedData.forEach((item) => {
    worksheet.addRow(item);
  });

  // Define the file path where you want to save the Excel file
  const filePath = "file/output66.xlsx";

  // Save the Excel workbook to the file
  workbook.xlsx
    .writeFile(filePath)
    .then(() => {
      console.log("Excel file saved to", filePath);
    })
    .catch((error) => {
      console.error("Error saving the Excel file:", error);
    });

  // Return the extracted data list.
  return "extractedData";
};

// getBatchUserCreditBalanceJsonAndExcel(
//   "real\\standart",
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => {
//   console.log(res);
// });

//Дансны харгалзах GROUP-ийг солих
// updateGroupUser("903572", "motforexdemo", MT5_SERVER_TYPE.DEMO).then((res) =>
//   console.log(res)
// );

//Идэвгүй болсон дансны эрхийг нээх

//Идэвхгүй болсон данснуудын мэдээллийг татах

//Дансны нууц үг солих
// chengePasswordUser("903572", "Qwer@1234", MT5_SERVER_TYPE.DEMO).then((res) =>
//   console.log(res)
// );

//Дансны LEVERAGE солих
// updateLeverageUser("903572", "200", MT5_SERVER_TYPE.DEMO).then((res) =>
//   console.log(res)
// );

//Данс цэнэглэх, зарлага гаргах /DEPOSIT, WITHDRAW REQ/

//TRADING ACCOUNT GROUP үүсгэх

//Trading account group-д байгаа арилжааны дансны мэдээллүүдийг татах, шалгах
// getGroupList("demo\\forex-hedge-usd-01", MT5_SERVER_TYPE.DEMO).then((res) =>
//   console.log(res)
// );

//Арилжааны түүх татах /DEAL/
// getDeal("903572", MT5_SERVER_TYPE.DEMO).then((res) => console.log(res));

//Арилжааны түүх устгах

//Арилжааны түүх засах

//Нээлттэй арилжаануудын мэдээлэл татах, устгах, засах /POSITIONS/
// getTotalPositionPage("903572", MT5_SERVER_TYPE.DEMO).then((res) =>
//   console.log(res)
// );
// deletePosition("182823", MT5_SERVER_TYPE.DEMO).then((res) => console.log(res));
// getMultiplePositionPage(
//   "903572",
//   "demo\\forex-hedge-usd-01",
//   MT5_SERVER_TYPE.DEMO
// ).then((res) => console.log(res));
// updatePosition(MT5_SERVER_TYPE.DEMO).then((res) => console.log(res));

//Pending order мэдээлэл татах, устгах, засах /ORDER/

//Өдрийн BALANCE татах /END OF DAY BALANCE/

//Өдрийн нийт COMMISSION татах

// getDailyReports("903572", MT5_SERVER_TYPE.DEMO).then((res) => console.log(res));

// const batchBalanceZero = async (logins, type) => {
//   const res = await authAndGetRequest(
//     `/api/trade/balance?login=${login}&type=${typee}&balance=${balance}&comment=${comment}`,
//     type
//   );
//   return res;
// };

// deposit(
//   "903572",
//   "3",
//   "-40.00",
//   encodeURIComponent("Negative balance correction"),
//   MT5_SERVER_TYPE.DEMO
// ).then((res) => console.log(res));

//BALANCE
// deposit(
//   "513504",
//   "2",
//   "48.26",
//   encodeURIComponent("Negative balance correction"),
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => console.log(res));

//CREDIT
// deposit(
//   "513504",
//   "3",
//   "-50.00",
//   encodeURIComponent("Negative balance correction"),
//   MT5_SERVER_TYPE.LIVE
// ).then((res) => console.log(res));

// batchBalanceZero("515563,516955,516956", MT5_SERVER_TYPE.LIVE).then((res) =>
//   console.log(res)
// );

// getUser("515563", MT5_SERVER_TYPE.LIVE).then((res) => console.log(res));

// getDealByTicket("575780", MT5_SERVER_TYPE.LIVE).then((res) => console.log(res));

//516692
