const PAYMENT_STATUSES = {
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  REQUESTED: "REQUESTED",
};

const PAYMENT_RESPONSE_CODES = {
  PAID: "PAID",
  NOT_PAID: "NOT_PAID",
};

const EVENTS = {
  TEST: "TEST",
  USER_REGISTERED: "USER_REGISTERED",
  CHALLANGE_PURCHASED: "CHALLANGE_PURCHASED",
};

const TRADING_ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  LOSE: "LOSE",
  PASSED: "PASSED",
};

const MT5_SERVER_TYPE = {
  LIVE: "LIVE",
  DEMO: "DEMO",
};

const MT5_GROUP_TYPE = {
  PRO: "real\\pro",
  STANDART: "real\\standart",
};
const EXCLUDE_LOGINS = [
  "511217",
  "511218",
  "511219",
  "511220",
  "511221",
  "511222",
  "511223",
  "516465",
  "516892",
  "1044",
];

const EXCLUDE_LOGINS_CREDIT_ZERO = [
  "511217",
  "517826",
  "517827",
  "511223",
  "511222",
  "511221",
  "511220",
  "511219",
];

module.exports = {
  PAYMENT_STATUSES,
  PAYMENT_RESPONSE_CODES,
  EVENTS,
  TRADING_ACCOUNT_STATUS,
  MT5_SERVER_TYPE,
  MT5_GROUP_TYPE,
  EXCLUDE_LOGINS,
  EXCLUDE_LOGINS_CREDIT_ZERO,
};
