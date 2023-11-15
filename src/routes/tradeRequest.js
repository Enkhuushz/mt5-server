const express = require("express");
let router = express.Router();

const {
  depositWithdrawController,
  creditzeroController,
} = require("../controller/tradeRequest");

const { checkBasicAuth } = require("../middlewares/authorize");

// 10) Deposit, Withraw
router.route("/:envtype/depositWithdraw").post(depositWithdrawController);
// Internal Transfer Credit Zero
// Solihoor bol Medegdeh
router.route("/:envtype/creditzero").post(checkBasicAuth, creditzeroController);

module.exports = router;
