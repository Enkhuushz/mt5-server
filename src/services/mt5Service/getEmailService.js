const { authAndGetRequest } = require("./MT5Request");
const { MT5_SERVER_TYPE } = require("../../lib/constants");
const fs = require("fs");
const ExcelJS = require("exceljs");

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
    const jsonDatas = jsonData;
    if (err) {
      console.error("An error occurred:", err);
    } else {
      const extractedData = [];

      for (const user of jsonDatas) {
        const login = user.Login;

        const userRes = await authAndGetRequest(
          `/api/user/get?login=${login}`,
          type
        );
        extractedData.push({
          Login: login,
          Email: userRes.answer.Email,
        });
      }
      const jsonData = JSON.stringify(extractedData, null, 2);

      // Write the JSON data to a file.
      fs.writeFile("file/output888.json", jsonData, (err) => {
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
        { header: "Email", key: "Email", width: 15 },
      ];

      // Add the data from the extractedData array to the worksheet
      extractedData.forEach((item) => {
        worksheet.addRow(item);
      });

      // Define the file path where you want to save the Excel file
      const filePath = "file/output888.xlsx";

      // Save the Excel workbook to the file
      workbook.xlsx
        .writeFile(filePath)
        .then(() => {
          console.log("Excel file saved to", filePath);
        })
        .catch((error) => {
          console.error("Error saving the Excel file:", error);
        });
    }
  });
};

getUsersTextFile(MT5_SERVER_TYPE.LIVE).then((res) => {
  console.log("hahah");
});
