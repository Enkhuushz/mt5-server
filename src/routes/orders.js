const express = require("express");
let router = express.Router();

const {
  getOpenOrderByTicketController,
  getTotalOpenOrderController,
  getOpenOrderByPageController,
  getMultipleOpenOrderController,
  getMultipleOpenOrderGroupController,
  updateOpenOrderController,
  deleteOpenOrderController,
} = require("../controller/orders");

router
  .route("/:envtype/getOpenOrderByTicket")
  .post(getOpenOrderByTicketController);
router.route("/:envtype/getTotalOpenOrder").post(getTotalOpenOrderController);
router.route("/:envtype/getOpenOrderByPage").post(getOpenOrderByPageController);
router
  .route("/:envtype/getMultipleOpenOrder")
  .post(getMultipleOpenOrderController);
router
  .route("/:envtype/getMultipleOpenOrderGroup")
  .post(getMultipleOpenOrderGroupController);
router.route("/:envtype/updateOpenOrder").post(updateOpenOrderController);

router.route("/:envtype/deleteOpenOrder").post(deleteOpenOrderController);

module.exports = router;
