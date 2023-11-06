const { Pool } = require("pg");

const pool = new Pool({
  user: "bridge_vjst_user",
  host: "dpg-cl47uijiu76s73b6dfbg-a.singapore-postgres.render.com",
  database: "bridge_vjst",
  password: "qrfkbzz6hpOqzabZff05b2Q1JcDx2tFh",
  port: 5432,
  ssl: true,
});

module.exports = pool;
