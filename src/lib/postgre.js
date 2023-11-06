const { Pool } = require("pg");

const pool = new Pool({
  user: "root",
  host: "dpg-cl4b7fhnovjs73c16utg-a.singapore-postgres.render.com",
  database: "bridge_7aiq",
  password: "OVNbX70zaDQDxMbHzsC89MnEp5I1LCsB",
  port: 5432,
  ssl: true,
});

module.exports = pool;
