const express = require("express");
let router = express.Router();

const {
  addUserController,
  deleteUserController,
  getUserController,
  updateUserGroupController,
  updateUserLeverageController,
  getMultipleUserGroupsController,
  changeUserPasswordController,
  getMultipleTradeStatesByLoginsController,
} = require("../controller/users");
// 0 Get User
router.route("/:envtype/getUser").post(getUserController);

// 1) Add USer
router.route("/:envtype/addUser").post(addUserController);

// 2) Delete User
router.route("/:envtype/deleteUser").post(deleteUserController);

// 4) USer Info -> /BALANCE, EQUITY, CREDIT, LEVERAGE, USED MARGIN, FREE MARGIN/
router
  .route("/:envtype/getMultipleTradeStatesByLogins")
  .post(getMultipleTradeStatesByLoginsController);

// 5) USer CHange Group
router.route("/:envtype/updateUserGroup").post(updateUserGroupController);

// 8) Change Password
router.route("/:envtype/changeUserPassword").post(changeUserPasswordController);

// 9) User Change Leverage
router.route("/:envtype/updateUserLeverage").post(updateUserLeverageController);

// 12) Trading account group-д байгаа арилжааны дансны мэдээллүүдийг татах, шалгах
router
  .route("/:envtype/getMultipleUserGroups")
  .post(getMultipleUserGroupsController);

module.exports = router;
