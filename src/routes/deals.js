const express = require("express");
let router = express.Router();

const {
  getDealByTicketController,
  getTotalDealController,
  getDealByPageController,
  getMultipleDealGroupController,
  getDealByPageNoDateController,
  updateDealController,
  deleteDealController,
} = require("../controller/deals");

// 13) Get Deal
// 14) Delete Deal
// 15) Update Deal

router
  .route("/:envtype/getMultipleDealGroupController")
  .post(getMultipleDealGroupController);

router.route("/:envtype/getTotalDeal").post(getTotalDealController);

router.route("/:envtype/getDealByPage").post(getDealByPageController);

router
  .route("/:envtype/getDealByPageNoDate")
  .post(getDealByPageNoDateController);

router.route("/:envtype/updateDeal").post(updateDealController);

router.route("/:envtype/deleteDeal").post(deleteDealController);

router
  .route("/:envtype/getDealByTicket/:ticket")
  .get(getDealByTicketController);

module.exports = router;
