const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorHandler");
const cron = require("node-cron");
const {
  batchBalanceLowHighAndCreditLowHigh,
  batchBalanceLowerThanZeroAndCreditZero,
} = require("../src/scheduled/balanceCorrection");
const {
  creditBalanceZeroCorrection,
} = require("../src/scheduled/creditBalanceCorrection");
const {
  creditZeroCorrection,
  creditZeroCorrectionWhenBalanceGreatherThanZero,
} = require("../src/scheduled/creditCorrection");

const { MT5_GROUP_TYPE, MT5_SERVER_TYPE } = require("../src/lib/constants");

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
  fileRoute,
} = require("./routes/index");

require("dotenv").config();

const env = process.env.NODE_ENV || "development";
const config = require("./config/config")[env];

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://frontend-excel-upload.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
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
app.use("/file", fileRoute);

cron.schedule("*/5 * * * *", async () => {
  if (!process.env.BASE_URL.includes("localhost")) {
    // await runCronJobsBalanceCorrection();
    // await runCronJobsCreditCorrection();
    // await runCronJobsCreditBalanceCorrection();
    // await runCronJobsCreditZeroCorrectionWhenBalanceGreatherThanZero();
  }
});

const runCronJobsBalanceCorrection = async () => {
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

    logger.info(`Cron job batchBalanceLowerThanZeroAndCreditZero GOLD started`);
    await batchBalanceLowerThanZeroAndCreditZero(
      MT5_GROUP_TYPE.GOLD,
      MT5_SERVER_TYPE.LIVE
    );
    logger.info(`Cron job batchBalanceLowerThanZeroAndCreditZero GOLD ended`);

    logger.info(`============================================================`);

    //

    logger.info(`Cron job batchBalanceLowHighAndCreditLowHigh PRO started`);
    await batchBalanceLowHighAndCreditLowHigh(
      MT5_GROUP_TYPE.PRO,
      0,
      100000.0,
      -1000,
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
      100000.0,
      -1000,
      0,
      MT5_SERVER_TYPE.LIVE
    );
    logger.info(`Cron job batchBalanceLowHighAndCreditLowHigh STANDART ended`);

    logger.info(`============================================================`);

    logger.info(`Cron job batchBalanceLowHighAndCreditLowHigh GOLD started`);
    await batchBalanceLowHighAndCreditLowHigh(
      MT5_GROUP_TYPE.GOLD,
      0,
      100000.0,
      -1000,
      0,
      MT5_SERVER_TYPE.LIVE
    );
    logger.info(`Cron job batchBalanceLowHighAndCreditLowHigh GOLD ended`);

    logger.info(`============================================================`);
  } catch (error) {
    logger.error(`Cron job encountered an error: ${error}`);
  }
};

const runCronJobsCreditZeroCorrectionWhenBalanceGreatherThanZero = async () => {
  try {
    logger.info(`============================================================`);

    logger.info(
      `Cron job creditZeroCorrectionWhenBalanceGreatherThanZero PRO started`
    );
    await creditZeroCorrectionWhenBalanceGreatherThanZero(
      MT5_GROUP_TYPE.PRO,
      MT5_SERVER_TYPE.LIVE
    );
    logger.info(
      `Cron job creditZeroCorrectionWhenBalanceGreatherThanZero PRO ended`
    );

    logger.info(`============================================================`);

    logger.info(
      `Cron job creditZeroCorrectionWhenBalanceGreatherThanZero STANDART started`
    );
    await creditZeroCorrectionWhenBalanceGreatherThanZero(
      MT5_GROUP_TYPE.STANDART,
      MT5_SERVER_TYPE.LIVE
    );
    logger.info(
      `Cron job creditZeroCorrectionWhenBalanceGreatherThanZero STANDART ended`
    );

    logger.info(`============================================================`);

    logger.info(
      `Cron job creditZeroCorrectionWhenBalanceGreatherThanZero GOLD started`
    );
    await creditZeroCorrectionWhenBalanceGreatherThanZero(
      MT5_GROUP_TYPE.GOLD,
      MT5_SERVER_TYPE.LIVE
    );
    logger.info(
      `Cron job creditZeroCorrectionWhenBalanceGreatherThanZero GOLD ended`
    );

    logger.info(`============================================================`);
  } catch (error) {
    logger.error(`Cron job encountered an error: ${error}`);
  }
};

const runCronJobsCreditCorrection = async () => {
  try {
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

const runCronJobsCreditBalanceCorrection = async () => {
  try {
    logger.info(`============================================================`);

    logger.info(`Cron job creditBalanceZeroCorrection PRO started`);
    await creditBalanceZeroCorrection(MT5_GROUP_TYPE.PRO, MT5_SERVER_TYPE.LIVE);
    logger.info(`Cron job creditBalanceZeroCorrection PRO ended`);

    logger.info(`============================================================`);

    logger.info(`Cron job creditBalanceZeroCorrection STANDART started`);
    await creditBalanceZeroCorrection(
      MT5_GROUP_TYPE.STANDART,
      MT5_SERVER_TYPE.LIVE
    );
    logger.info(`Cron job creditBalanceZeroCorrection STANDART ended`);

    logger.info(`============================================================`);

    logger.info(`Cron job creditBalanceZeroCorrection GOLD started`);
    await creditBalanceZeroCorrection(
      MT5_GROUP_TYPE.GOLD,
      MT5_SERVER_TYPE.LIVE
    );
    logger.info(`Cron job creditBalanceZeroCorrection GOLD ended`);

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
