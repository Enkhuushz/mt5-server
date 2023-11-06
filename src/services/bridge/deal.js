const logger = require("../../config/winston");
const pool = require("../../lib/postgre");

const get = async () => {
  try {
    console.log("data");

    const query = "SELECT * FROM tb_deal";
    const results = await pool.query(query);
    console.log(results.rows);
    return results.rows;
  } catch (error) {
    logger.error(`SENT ERROR ${error}`);
  }
};

module.exports = {
  get,
};
