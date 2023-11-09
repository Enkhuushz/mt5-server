const { authAndGetRequest, authAndPostRequest } = require("../MT5Request");
const { MT5_SERVER_TYPE } = require("../../../lib/constants");
const logger = require("../../../config/winston");

/**
 * Adds a new group with the given name and type.
 * @param {string} name - The name of the group to be added.
 * @param {string} type - The type of the group to be added.
 * @returns {Promise<Object>} - A Promise that resolves with the response object from the server.
 */
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

/**
 * Retrieves a group of items from the server.
 * @async
 * @param {number} index - The index of the first item to retrieve.
 * @param {number} number - The number of items to retrieve.
 * @param {string} type - The type of the items to retrieve.
 * @returns {Promise<object>} - A promise that resolves with the retrieved items.
 */
const getGroup = async (index, number, type) => {
  console.log(`/api/group/next?index=${index}&count=${number}`);
  console.log(type);
  const res = await authAndGetRequest(
    `/api/group/next?index=${index}&count=${number}`,
    type
  );
  return res;
};

/**
 * Retrieves a group by its name.
 * @param {string} name - The name of the group to retrieve.
 * @param {string} type - The type of authentication to use.
 * @returns {Promise<Object>} - A Promise that resolves with the retrieved group.
 */
const getGroupByName = async (name, type) => {
  const res = await authAndGetRequest(`/api/group/get?group=${name}`, type);
  return res;
};

module.exports = {
  addGroup,
  getGroup,
  getGroupByName,
};
