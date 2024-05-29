const { authAndGetRequest, authAndPostRequest } = require("../MT5Request");
const logger = require("../../../config/winston");
const { MT5_SERVER_TYPE } = require("../../../lib/constants");

const indexList = async (type) => {
  const res = await authAndGetRequest(`/api/symbol/get?mask=*`, type);
  console.log(res.answer);
  return res;
};

indexList(MT5_SERVER_TYPE.LIVE).then((e) => {
  console.log("res");
});
