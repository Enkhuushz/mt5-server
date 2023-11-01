const mongoose = require("mongoose");

const currencyRate = mongoose.Schema(
  {
    date: { type: String, required: true, unique: true },
    symbol: { type: String, required: true },
    rate: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const CurrencyRate = mongoose.model("CurrencyRate", currencyRate);
CurrencyRate.schema.options.validateBeforeSave = true;

module.exports = CurrencyRate;
