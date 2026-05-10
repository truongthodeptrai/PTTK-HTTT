const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false, // Nếu bạn sử dụng SQL Server trên Windows, có thể để false
    trustServerCertificate: true, // Chỉ nên dùng trong môi trường phát triển
  },
};

const pool = sql.connect(config);
module.exports = {
  sql,
  pool,
};
