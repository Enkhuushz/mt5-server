const express = require("express");
let router = express.Router();
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs-extra");
const mime = require("mime-types");
const path = require("path");

const logger = require("../config/winston");
const { sendSuccess, sendError } = require("../utils/response");
const { doFiftyPercentCashBackController } = require("../controller/cashback");

let upload = multer({ dest: "uploads/" });

router.post("/read", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file);
    if (req.file?.filename == null || req.file?.filename == "undefined") {
      return sendError(res, "no file", 400);
    } else {
      const filePath = `uploads/${req.file.filename}`;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      console.log(jsonData);

      fs.remove(filePath);

      return sendSuccess(res, "success", 200, jsonData);
    }
  } catch (error) {
    logger.error(`/GET /ebarimt ERROR: ${error.message}`);
    return sendError(res, error.message, 500);
  }
});

router
  .route("/:envtype/cashback")
  .post(upload.single("file"), doFiftyPercentCashBackController);

router.get("/download", async (req, res) => {
  try {
    const file = "file/ccc.xlsx";
    const filename = path.basename(file);

    console.log(filename);

    const mimetype = mime.lookup(file);
    res.setHeader("Content-Disposition", `attachment;filename=${filename}`);
    res.setHeader("Content-Type", mimetype);

    setTimeout(() => {
      res.download(file);
    }, 2000);
  } catch (error) {
    logger.error(`/GET /ebarimt ERROR: ${error.message}`);
    return sendError(res, error.message, 500);
  }
});

module.exports = router;
