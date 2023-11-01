const {
  authAndGetRequest,
  authAndPostRequest,
} = require("../mt5Service/MT5Request");
const { MT5_SERVER_TYPE } = require("../../lib/constants");
const logger = require("../../config/winston");

const addGroup = async (name, type) => {
  const res = await authAndPostRequest(
    `/api/group/add`,
    {
      Group: name,
      Server: "1",
      PermissionsFlags: "2",
      AuthMode: "0",
      AuthPasswordMin: "8",
      Company: "MOT Forex LLC",
      Currency: "USD",
    },
    type
  );
  return res;
};

const getGroup = async (index, number, type) => {
  console.log(`/api/group/next?index=${index}&count=${number}`);
  console.log(type);
  const res = await authAndGetRequest(
    `/api/group/next?index=${index}&count=${number}`,
    type
  );
  return res;
};

const getGroupByName = async (name, type) => {
  const res = await authAndGetRequest(`/api/group/get?group=${name}`, type);
  return res;
};

// getGroupByName("demo\\forex-hedge-usd-01", MT5_SERVER_TYPE.DEMO).then((res) => {
//   console.log(res);
// });

// getGroup(0, 20, MT5_SERVER_TYPE.DEMO).then((res) => {
//   console.log(res);
// });

// addGroup(MT5_SERVER_TYPE.DEMO).then((res) => {
//   console.log(res);
// });

module.exports = {
  addGroup,
  getGroup,
  getGroupByName,
};
