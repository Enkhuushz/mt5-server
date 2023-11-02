const fs = require("fs");
const ExcelJS = require("exceljs");

const generateJson = (data, path) => {
  const jsonData = JSON.stringify(data, null, 2);

  // Write the JSON data to a file.
  fs.writeFile(`filev3/${path}.json`, jsonData, (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log("Filtered JSON data saved to", `filev2/${path}.json`);
    }
  });
};

const generateExcel = (data, path, columns) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  worksheet.columns = [];

  for (const c of columns) {
    worksheet.columns.push({
      header: c,
      key: c,
      width: 15,
    });
  }

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // Define the file path where you want to save the Excel file
  const filePath = `filev2/${path}.xlsx`;

  // Save the Excel workbook to the file
  workbook.xlsx
    .writeFile(filePath)
    .then(() => {
      console.log("Excel file saved to", filePath);
    })
    .catch((error) => {
      console.error("Error saving the Excel file:", error);
    });
};

module.exports = {
  generateJson,
  generateExcel,
};
