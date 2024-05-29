const { authAndGetRequest, authAndPostRequest } = require("../MT5Request");
const { generate } = require("../../../utils/utils");
const logger = require("../../../config/winston");
const moment = require("moment");
const { toTimestamp } = require("../../../utils/utils");
const ExcelJS = require("exceljs");
const { MT5_SERVER_TYPE } = require("../../../lib/constants");

const getMultipleUserGroups = async (groups, type) => {
  const res = await authAndGetRequest(
    `/api/user/get_batch?group=${groups}`,
    type
  );
  const currentDate = moment();
  let list = [];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  worksheet.columns = [{ header: "login", key: "login", width: 15 }];

  for (const e of res.answer) {
    const login = e.Login;
    const regDate = e.Registration;

    const registrationTimestamp = parseInt(regDate, 10);
    const hasPassed32Days = checkIfPassed32Days(
      currentDate,
      registrationTimestamp
    );

    if (hasPassed32Days) {
      const timestampFrom = toTimestamp("2020-03-01 00:00:00");
      const timestampTo = toTimestamp("2025-03-01 00:00:00");

      const resTotal = await authAndGetRequest(
        `/api/deal/get_total?login=${login}&from=${timestampFrom}&to=${timestampTo}`,
        type
      );
      const totalRecords = resTotal.answer.total;

      if (totalRecords == "0") {
        list.push(login);
      }
    }
  }

  list.forEach((item) => {
    worksheet.addRow(item);
  });

  const filePath = `file/archivedLogins${groups.split("\\")[1]}.xlsx`;

  workbook.xlsx
    .writeFile(filePath)
    .then(() => {
      console.log("Excel file saved to", filePath);
    })
    .catch((error) => {
      console.error("Error saving the Excel file:", error);
    });

  return "res";
};

const checkIfPassed32Days = (currentDate, registrationTimestamp) => {
  const registrationDate = moment.unix(registrationTimestamp);
  const daysPassed = currentDate.diff(registrationDate, "days");

  return daysPassed > 32;
};

getMultipleUserGroups("real\\xauusd", MT5_SERVER_TYPE.LIVE).then((res) => {
  console.lo("dome");
});
