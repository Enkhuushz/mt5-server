const mongoose = require("mongoose");

const skipLoginSchema = mongoose.Schema(
  {
    login: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const SkipLogin = mongoose.model("SkipLogin", skipLoginSchema);
SkipLogin.schema.options.validateBeforeSave = true;

module.exports = SkipLogin;
