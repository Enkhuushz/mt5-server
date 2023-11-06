const express = require("express");
let router = express.Router();

const {
  getMultiplePositionGroupController,
  getPositionBySymbolController,
  getTotalPositionController,
  getPositionByPageController,
  updatePositionController,
  deletePositionController,
} = require("../controller/positions");

// 16) Get Position
// 16) Delete Position
// 16) Update Position

router
  .route("/:envtype/getMultiplePositionGroup")
  .post(getMultiplePositionGroupController);

router
  .route("/:envtype/getPositionBySymbol")
  .post(getPositionBySymbolController);

router.route("/:envtype/getTotalPosition").post(getTotalPositionController);

router.route("/:envtype/getPositionByPage").post(getPositionByPageController);

router.route("/:envtype/updatePosition").post(updatePositionController);

router.route("/:envtype/deletePosition").post(deletePositionController);

module.exports = router;
