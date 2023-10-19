const express = require("express");
const cors = require("cors");
const http = require("http");
const errorHandler = require("./middlewares/errorHandler");
const cron = require("node-cron");
const {
  batchBalanceLowHighAndCredit,
} = require("../src/services/mt5Service/batchBalanceCredit");
const { MT5_GROUP_TYPE, MT5_SERVER_TYPE } = require("../src/lib/constants");
// Here import the routes
const logger = require("../src/config/winston");

require("dotenv").config();

const env = process.env.NODE_ENV || "development";
const config = require("./config/config")[env];

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const loggingMiddleware = (req, res, next) => {
  logger.info(
    `New request received: ip = ${req.ip}, url = ${req.url}, method = ${req.method}`
  );

  next();
};

app.use(loggingMiddleware);

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    data: "working...",
  });
});

cron.schedule("0 */2 * * *", async () => {
  try {
    logger.info(`Cron job PRO started`);
    batchBalanceLowHighAndCredit(
      MT5_GROUP_TYPE.PRO,
      50.0,
      -72,
      0,
      MT5_SERVER_TYPE.LIVE
    ).then((resultPro) => {
      logger.info(`Cron job PRO ran successfully. Result: ${resultPro}`);
      logger.info(`Cron job STANDART started`);
      batchBalanceLowHighAndCredit(
        MT5_GROUP_TYPE.STANDART,
        50.0,
        -72,
        0,
        MT5_SERVER_TYPE.LIVE
      ).then((resultStandart) => {
        logger.info(
          `Cron job STANDART ran successfully. Result: ${resultStandart}`
        );
      });
    });
  } catch (error) {
    logger.error(`Cron job encountered an error: ${error}`);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
server.listen(PORT, logger.info(`server started on port ${PORT}`));
