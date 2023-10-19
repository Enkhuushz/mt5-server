const { authAndGetRequest, authAndPostRequest } = require("./MT5Request");
const { MT5_SERVER_TYPE } = require("../../lib/constants");
const { log } = require("winston");
const fs = require("fs");
const ExcelJS = require("exceljs");

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

const getDeal = async (login, type) => {
  const res = await authAndGetRequest(
    `/api/deal/get_page?login=${login}&offset=0&total=3`,
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

getBatchUser("real\\pro", MT5_SERVER_TYPE.LIVE).then((res) => {
  const filteredData = res.answer.filter((item) => {
    const balance = parseFloat(item.Balance);
    const credit = parseFloat(item.Credit);

    return balance < 0.0 && credit == 50.0;
  });

  const extractedData = filteredData.map((item) => ({
    Login: item.Login,
    Group: item.Group,
    Name: item.Name,
    Balance: item.Balance,
    Leverage: item.Leverage,
    Credit: item.Credit,
  }));

  console.log(extractedData.length);

  const filePath = "file/output44.json";

  const jsonData = JSON.stringify(extractedData, null, 2);

  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log("Filtered JSON data saved to", filePath);
    }
  });
});

getBatchUser("real\\pro", MT5_SERVER_TYPE.LIVE).then((res) => {
  const filteredData = res.answer.filter((item) => {
    const balance = parseFloat(item.Balance);
    const credit = parseFloat(item.Credit);

    return balance < 0.0 && credit == 50.0;
  });

  const extractedData = filteredData.map((item) => ({
    Login: item.Login,
    Group: item.Group,
    Name: item.Name,
    Balance: item.Balance,
    Leverage: item.Leverage,
    Credit: item.Credit,
  }));

  console.log(extractedData.length);
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
  const filePath = "file/output44.xlsx";

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
