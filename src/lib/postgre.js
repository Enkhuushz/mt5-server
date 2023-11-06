const { Pool } = require("pg");

const pool = new Pool({
  user: "root",
  host: "dpg-cl4ac81novjs73c0jv20-a.singapore-postgres.render.com",
  database: "bridge_y397",
  password: "ZIESM7zHeIgQulbmsnnH9cHfGJ92Pkyt",
  port: 5432,
  ssl: true,
});

module.exports = pool;
