const express = require("express");
let router = express.Router();

const {
  getPositionBySymbolController,
  getTotalPositionController,
  getPositionByPageController,
  getMultiplePositionController,
  getMultiplePositionGroupController,
  updatePositionController,
  deletePositionController,
  checkPositionController,
  fixPositionController,
} = require("../controller/positions");

router
  .route("/:envtype/getPositionBySymbol")
  .get(getPositionBySymbolController);
router.route("/:envtype/getTotalPosition").get(getTotalPositionController);
router.route("/:envtype/getPositionByPage").get(getPositionByPageController);
router
  .route("/:envtype/getMultiplePosition")
  .get(getMultiplePositionController);
router
  .route("/:envtype/getMultiplePositionGroup")
  .get(getMultiplePositionGroupController);
router.route("/:envtype/updatePosition").get(updatePositionController);
router.route("/:envtype/deletePosition").get(deletePositionController);
router.route("/:envtype/checkPosition").get(checkPositionController);
router.route("/:envtype/fixPosition").get(fixPositionController);

module.exports = router;
