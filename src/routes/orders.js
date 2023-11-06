const express = require("express");
let router = express.Router();

const {
  getOpenOrderByTicketController,
  getTotalOpenOrderController,
  getOpenOrderByPageController,
  getMultipleOpenOrderGroupController,
  updateOpenOrderController,
  deleteOpenOrderController,
} = require("../controller/orders");

// 17) Get ORder
// 17) Delete ORder
// 17) Update ORder
router
  .route("/:envtype/getOpenOrderByTicket")
  .post(getOpenOrderByTicketController);

router.route("/:envtype/getTotalOpenOrder").post(getTotalOpenOrderController);

router.route("/:envtype/getOpenOrderByPage").post(getOpenOrderByPageController);

router
  .route("/:envtype/getMultipleOpenOrderGroup")
  .post(getMultipleOpenOrderGroupController);

router.route("/:envtype/updateOpenOrder").post(updateOpenOrderController);

router.route("/:envtype/deleteOpenOrder").post(deleteOpenOrderController);

module.exports = router;
