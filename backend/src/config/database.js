const sql = require('mssql');
const config = require('./index');

let pool;

async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(config.db);
  return pool;
}

module.exports = {
  sql,
  getPool,
};