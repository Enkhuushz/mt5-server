const xlsx = require("xlsx");
const fs = require("fs");
const { sendEmail, sendEmailFunds } = require("../emailService");
const logger = require("../../config/winston");
const ExcelJS = require("exceljs");

const regex = /'(\d+)' deleted \[profit: ([-\d.]+)\]/;

const get = async () => {
  try {
    const list = await read();
    const extractedData = extractData(list);

    // console.log(extractedData);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.columns = [
      { header: "login", key: "login", width: 15 },
      { header: "profit", key: "profit", width: 15 },
    ];

    extractedData.forEach((item) => {
      console.log(item);
      worksheet.addRow(item);
    });

    // Define the file path where you want to save the Excel file
    const filePath = `file/extracted.xlsx`;

    // Save the Excel workbook to the file
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

const extractData = (data) => {
  return data
    .map((row) => {
      // The key seems to be dynamic based on the presence of a column name
      // We need to find the correct key that contains our data
      const key = Object.keys(row).find(
        (k) => k.startsWith("__EMPTY") || k === "position"
      );
      if (!key) return null; // Skip if the key isn't found

      const positionString = row[key];
      //   console.log(positionString);

      const matches = regex.exec(positionString);
      if (matches) {
        const extractedData = {
          login: matches[1], // ID
          profit: parseFloat(matches[2]), // Profit value
        };
        return extractedData;
      }
      return null;
    })
    .filter((entry) => entry != null); // Filter out any non-matching rows
};

const read = async () => {
  try {
    const filePath = `file/positions.xlsx`;

    if (fs.existsSync(filePath)) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      return jsonData;
    }
    return "false";
  } catch (error) {
    logger.error(`read excel ERROR ${error}`);
  }
};

// get().then((res) => {
//   console.log("res");
// });
