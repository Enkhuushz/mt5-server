const axios = require("axios");
const logger = require("../config/winston");
const { Receipt, CurrencyRate } = require("../model");

const getCurrencyRate = async () => {
  try {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const todayString = today.toISOString().substring(0, 10);
    const yesterdayString = yesterday.toISOString().substring(0, 10);

    const url = process.env.MONGOL_BANK_CURRENCY_RATE_URL.replace(
      "{startDate}",
      yesterdayString
    );

    const replacedUrl = url.replace("{endDate}", todayString);

    const response = await axios.post(replacedUrl, {});

    const rateString = response.data.data[response.data.data.length - 1].USD;

    const foundCurrencyRate = await CurrencyRate({
      date: response.data.data[response.data.data.length - 1].RATE_DATE,
    });
    if (!foundCurrencyRate) {
      const currencyRate = new CurrencyRate({
        date: response.data.data[response.data.data.length - 1].RATE_DATE,
        symbol: "USD",
        rate: parseFloat(rateString.replace(/,/g, "")),
      });
      await currencyRate.save();
    }
  } catch (err) {
    logger.error(`SENT ERROR ${err}`);
  }
};
module.exports = {
  getCurrencyRate,
};
