const express = require("express");
let router = express.Router();

const {
  addGroupController,
  getGroupController,
  getGroupByNameController,
} = require("../controller/group");

// 11) Accoint Group Create

router.route("/:envtype/addGroup").post(addGroupController);
router.route("/:envtype/getGroup").post(getGroupController);
router.route("/:envtype/getGroupByName").post(getGroupByNameController);

module.exports = router;
