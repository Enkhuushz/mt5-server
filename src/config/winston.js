const winston = require("winston");
require("winston-daily-rotate-file");
require("dotenv").config();
const { combine, timestamp, label, printf } = winston.format;

const { LOG_PATH } = process.env;

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${new Date(timestamp).toLocaleDateString()} ${new Date(
    timestamp
  ).toLocaleTimeString()} [${label}] ${level}: ${message}`;
});

const options = {
  dailyRotate: {
    filename: `${LOG_PATH}/app-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxFiles: "30d", // Retain logs for 30 days
    colorize: true,
  },
  file: {
    filename: `${LOG_PATH}/app.log`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  console: {
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  format: combine(label({ label: "SERVICE MT5" }), timestamp(), customFormat),
  transports: [
    new winston.transports.Console(options.console),
    //new winston.transports.DailyRotateFile(options.dailyRotate),
    new winston.transports.File(options.file),
    new winston.transports.DailyRotateFile(options.dailyRotate),
  ],
});

module.exports = logger;
