const express = require("express");
let router = express.Router();

const { depositWithdrawController } = require("../controller/tradeRequest");

// 10) Deposit, Withraw
router.route("/:envtype/depositWithdraw").post(depositWithdrawController);

module.exports = router;
