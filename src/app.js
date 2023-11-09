const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorHandler");
const cron = require("node-cron");
const {
  batchBalanceLowHighAndCreditLowHigh,
  batchBalanceLowerThanZeroAndCreditZero,
} = require("../src/services/mt5Service/batchBalanceCredit");
const {
  creditZeroCorrection,
} = require("../src/services/creditCorrection/creditToZeroCorrection");

const { MT5_GROUP_TYPE, MT5_SERVER_TYPE } = require("../src/lib/constants");

// Here import the routes
const logger = require("../src/config/winston");

const {
  dealRoute,
  groupRoute,
  ordersRoute,
  positionsRoute,
  tradeRequestRoute,
  usersRoute,
  ebarimtRoute,
  bridgeRoute,
} = require("./routes/index");

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

app.get("/", (req, res) => {
  return res.send("<h1>Hello world</h1>");
});

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    data: "working...",
  });
});

//Routes
app.use("/ebarimt", ebarimtRoute);
app.use("/deal", dealRoute);
app.use("/group", groupRoute);
app.use("/order", ordersRoute);
app.use("/position", positionsRoute);
app.use("/user", usersRoute);
app.use("/trade-request", tradeRequestRoute);
app.use("/bridge", bridgeRoute);

cron.schedule("0 * * * *", async () => {
  if (!process.env.BASE_URL.includes("localhost")) {
    await runCronJobs();
  }
});

const runCronJobs = async () => {
  try {
    logger.info(
      `============================================================+`
    );
    logger.info(`Cron job batchBalanceLowerThanZeroAndCreditZero PRO started`);
    await batchBalanceLowerThanZeroAndCreditZero(
      MT5_GROUP_TYPE.PRO,
      MT5_SERVER_TYPE.LIVE
    );
    logger.info(`Cron job batchBalanceLowerThanZeroAndCreditZero PRO ended`);

    logger.info(`============================================================`);

    logger.info(
      `Cron job batchBalanceLowerThanZeroAndCreditZero STANDART started`
    );
    await batchBalanceLowerThanZeroAndCreditZero(
      MT5_GROUP_TYPE.STANDART,
      MT5_SERVER_TYPE.LIVE
    );
    logger.info(
      `Cron job batchBalanceLowerThanZeroAndCreditZero STANDART ended`
    );

    logger.info(`============================================================`);

    logger.info(`Cron job batchBalanceLowHighAndCreditLowHigh PRO started`);
    await batchBalanceLowHighAndCreditLowHigh(
      MT5_GROUP_TYPE.PRO,
      0,
      50.0,
      -100,
      0,
      MT5_SERVER_TYPE.LIVE
    );
    logger.info(`Cron job batchBalanceLowHighAndCreditLowHigh PRO ended`);

    logger.info(`============================================================`);

    logger.info(
      `Cron job batchBalanceLowHighAndCreditLowHigh STANDART started`
    );
    await batchBalanceLowHighAndCreditLowHigh(
      MT5_GROUP_TYPE.STANDART,
      0,
      50.0,
      -100,
      0,
      MT5_SERVER_TYPE.LIVE
    );
    logger.info(`Cron job batchBalanceLowHighAndCreditLowHigh STANDART ended`);

    logger.info(`============================================================`);

    logger.info(`Cron job creditZeroCorrection PRO started`);
    await creditZeroCorrection(MT5_GROUP_TYPE.PRO, MT5_SERVER_TYPE.LIVE);
    logger.info(`Cron job creditZeroCorrection PRO ended`);

    logger.info(`============================================================`);

    logger.info(`Cron job creditZeroCorrection STANDART started`);
    await creditZeroCorrection(MT5_GROUP_TYPE.STANDART, MT5_SERVER_TYPE.LIVE);
    logger.info(`Cron job creditZeroCorrection STANDART ended`);

    logger.info(`============================================================`);

    logger.info(`Cron job creditZeroCorrection GOLD started`);
    await creditZeroCorrection(MT5_GROUP_TYPE.GOLD, MT5_SERVER_TYPE.LIVE);
    logger.info(`Cron job creditZeroCorrection GOLD ended`);

    logger.info(`============================================================`);
  } catch (error) {
    logger.error(`Cron job encountered an error: ${error}`);
  }
};

app.use(errorHandler);

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    logger.info("MongoDb is connecting...");

    const PORT = process.env.PORT || 8000;
    server.listen(PORT, logger.info(`server started on port ${PORT}`));
  });
