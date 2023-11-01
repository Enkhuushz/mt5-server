const express = require("express");
let router = express.Router();

const {
  addUserController,
  updateUserGroupController,
  deleteUserController,
  getUserController,
  getUserByExternalAccountController,
  getMultipleUserGroupsController,
  getMultipleUserLoginsController,
  checkUserPasswordController,
  changeUserPasswordController,
  getTradeStatusController,
  getMultipleTradeStatesByLoginsController,
  getMultipleTradeStatesByGroupsController,
  getLoginListController,
  getTotalUserController,
  getUserGroupController,
  checkBlanceController,
  moveUserArchiveController,
  getUserArchiveController,
  getMultipleUserArchiveByLoginController,
  getMultipleUserArchiveByGroupsController,
} = require("../controller/users");

router.route("/:envtype/addUser").get(addUserController);
router.route("/:envtype/updateUserGroup").get(updateUserGroupController);
router.route("/:envtype/deleteUser").get(deleteUserController);
router.route("/:envtype/getUser").get(getUserController);
router
  .route("/:envtype/getUserByExternalAccount")
  .get(getUserByExternalAccountController);
router
  .route("/:envtype/getMultipleUserGroups")
  .get(getMultipleUserGroupsController);
router
  .route("/:envtype/getMultipleUserLogins")
  .get(getMultipleUserLoginsController);
router.route("/:envtype/checkUserPassword").get(checkUserPasswordController);
router.route("/:envtype/changeUserPassword").get(changeUserPasswordController);
router.route("/:envtype/getTradeStatus").get(getTradeStatusController);
router
  .route("/:envtype/getMultipleTradeStatesByLogins")
  .get(getMultipleTradeStatesByLoginsController);
router
  .route("/:envtype/getMultipleTradeStatesByGroups")
  .get(getMultipleTradeStatesByGroupsController);
router.route("/:envtype/getLoginList").get(getLoginListController);
router.route("/:envtype/getTotalUser").get(getTotalUserController);
router.route("/:envtype/getUserGroup").get(getUserGroupController);
router.route("/:envtype/checkBlance").get(checkBlanceController);
router.route("/:envtype/moveUserArchive").get(moveUserArchiveController);
router.route("/:envtype/getUserArchive").get(getUserArchiveController);
router
  .route("/:envtype/getMultipleUserArchiveByLogin")
  .get(getMultipleUserArchiveByLoginController);
router
  .route("/:envtype/getMultipleUserArchiveByGroups")
  .get(getMultipleUserArchiveByGroupsController);

module.exports = router;
