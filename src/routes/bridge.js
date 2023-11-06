const express = require("express");
let router = express.Router();

const { getController } = require("../controller/bridge");

router.route("/deal").get(getController);

module.exports = router;
