const express = require("express");
let router = express.Router();

const {
  depositWithdrawController,
  checkMarginController,
  calculateProfitForPositionController,
  sendRequestController,
  getRequestResultController,
} = require("../controller/tradeRequest");

router.route("/:envtype/depositWithdraw").get(depositWithdrawController);
router.route("/:envtype/checkMargin").get(checkMarginController);
router
  .route("/:envtype/calculateProfitForPosition")
  .get(calculateProfitForPositionController);
router.route("/:envtype/sendRequest").get(sendRequestController);
router.route("/:envtype/getRequestResult").get(getRequestResultController);

module.exports = router;
