const { MT5_SERVER_TYPE } = require("../../lib/constants");
const { generateJson } = require("../../utils/file");
const { toTimestamp } = require("../../utils/utils");
const { authAndGetRequest } = require("../mt5Service/MT5Request");
const Decimal = require("decimal.js");
const ExcelJS = require("exceljs");

const getNoDeposit = async (groups, fromDate, toDate, type, day) => {
  try {
    const res = await authAndGetRequest(
      `/api/user/get_batch?group=${groups}`,
      type
    );

    const filteredDatas = res.answer.filter((item) => {
      const parsedBalance = parseFloat(item.Balance);

      return parsedBalance < 10.0 && parsedBalance >= 0.0;
    });

    const resultArray = [];

    const timestampFrom = toTimestamp(fromDate);
    const timestampTo = toTimestamp(toDate);

    const today = new Date();
    const dayAgo = new Date(today);
    dayAgo.setDate(today.getDate() - day);

    for (const filtered of filteredDatas) {
      const login = filtered.Login;

      const resTotal = await authAndGetRequest(
        `/api/deal/get_total?login=${login}&from=${timestampFrom}&to=${timestampTo}`,
        type
      );

      const totalRecords = resTotal.answer.total;

      console.log(`totalRecords: ${totalRecords}`);

      if (totalRecords > 0) {
        const resDeal = await authAndGetRequest(
          `/api/deal/get_page?login=${login}&from=${timestampFrom}&to=${timestampTo}&offset=${
            totalRecords - 1
          }&total=1`,
          type
        );

        const timestamp = parseInt(resDeal.answer[0].Time, 10) * 1000;
        let date;

        if (timestamp < 1702770513000) {
          date = new Date(timestamp);
        } else {
          date = new Date(timestamp - 6 * 60 * 60 * 1000);
        }

        if (date.getTime() < dayAgo.getTime()) {
          console.log(`${date.toISOString()} is 10 days before today.`);
          resultArray.push({
            login,
            date: date.toISOString(),
            parsedBalance: parseFloat(filtered.Balance),
            group: groups,
            email: filtered.Email,
            phone: filtered.Phone,
          });
        }
      }
    }
    generateExcell(resultArray, `${groups.split("\\")[1]}10dayNoDeposit`);
  } catch (error) {
    console.log(error);
  }
};

function generateExcell(list, path) {
  try {
    //  Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.columns = [
      { header: "login", key: "login", width: 15 },
      { header: "date", key: "date", width: 15 },
      { header: "parsedBalance", key: "parsedBalance" },
      { header: "group", key: "group", width: 15 },
      { header: "email", key: "email", width: 15 },
      { header: "phone", key: "phone", width: 15 },
    ];

    list.forEach((item) => {
      worksheet.addRow(item);
    });

    const filePath = `file/${path}.xlsx`;

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
  getNoDeposit,
};
