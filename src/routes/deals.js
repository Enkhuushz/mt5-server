const express = require("express");
let router = express.Router();

const {
  getDealByTicketController,
  getTotalDealController,
  getDealByPageController,
  getMultipleDealGroupController,
  getDealByPageNoDateController,
  getMultipleDealController,
  getMultipleDealGroupDateForSkipLoginController,
  getMultipleDealGroupDateV2Controller,
  getMultipleDealGroupDateV2TestController,
  getMultipleDealGroupDateController,
  updateDealController,
  deleteDealController,
} = require("../controller/deals");

router
  .route("/:envtype/getDealByTicket/:ticket")
  .get(getDealByTicketController);
router.route("/:envtype/getTotalDeal").post(getTotalDealController);
router.route("/:envtype/getDealByPage").post(getDealByPageController);
router
  .route("/:envtype/getMultipleDealGroupController")
  .post(getMultipleDealGroupController);
router
  .route("/:envtype/getDealByPageNoDate")
  .get(getDealByPageNoDateController);
router.route("/:envtype/getMultipleDeal").get(getMultipleDealController);
router
  .route("/:envtype/getMultipleDealGroupDateForSkipLogin")
  .get(getMultipleDealGroupDateForSkipLoginController);
router
  .route("/:envtype/getMultipleDealGroupDateV2")
  .get(getMultipleDealGroupDateV2Controller);
router
  .route("/:envtype/getMultipleDealGroupDateV2Test")
  .get(getMultipleDealGroupDateV2TestController);
router
  .route("/:envtype/getMultipleDealGroupDate")
  .get(getMultipleDealGroupDateController);
router.route("/:envtype/updateDeal").get(updateDealController);
router.route("/:envtype/deleteDeal").get(deleteDealController);

module.exports = router;
