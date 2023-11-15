const mongoose = require("mongoose");

const ReceiptSchema = mongoose.Schema(
  {
    id: String,
    version: String,
    totalAmount: Number,
    totalVAT: Number,
    totalCityTax: Number,
    branchNo: String,
    districtCode: String,
    merchantTin: String,
    posNo: String,
    type: String,
    receipts: [
      {
        id: String,
        totalAmount: Number,
        taxType: String,
        items: [
          {
            name: String,
            barCode: String,
            barCodeType: String,
            classificationCode: String,
            measureUnit: String,
            qty: Number,
            unitPrice: Number,
            totalAmount: Number,
            totalVAT: Number,
            totalCityTax: Number,
          },
        ],
        merchantTin: String,
        totalVAT: Number,
        totalCityTax: Number,
      },
    ],
    payments: [
      {
        code: String,
        paidAmount: Number,
        status: String,
      },
    ],
    posId: Number,
    status: String,
    date: String,
    email: String,
  },
  {
    timestamps: true,
  }
);

const Receipt = mongoose.model("Receipt", ReceiptSchema);

module.exports = Receipt;
