const fs = require("fs");
const ExcelJS = require("exceljs");

const generateJson = (data, path) => {
  const jsonData = JSON.stringify(data, null, 2);

  // Write the JSON data to a file.
  fs.writeFile(`file/${path}.json`, jsonData, (err) => {
    if (err) {
      console.error("Error... writing JSON file:", err);
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

  const filePath = `filev2/${path}.xlsx`;

  workbook.xlsx
    .writeFile(filePath)
    .then(() => {
      console.log("Excel file saved to", filePath);
    })
    .catch((error) => {
      console.error("Error saving the Excel file:", error);
    });
};

function readFromTextToList(callback, path) {
  const filePath = `file/${path}.txt`;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading text file:", err);
      callback(err, null);
    } else {
      const list = data.trim().split("\n");
      callback(null, list);
    }
  });
}

function readFromFileJson(callback, path) {
  const filePath = `file/loginsWhoGot50BonusMonth10.json`;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading json file:", err);
      callback(err, null);
    } else {
      callback(null, JSON.parse(data));
    }
  });
}

module.exports = {
  generateJson,
  generateExcel,
  readFromTextToList,
  readFromFileJson,
};
