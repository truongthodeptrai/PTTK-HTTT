const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
      encrypt: false,
      trustServerCertificate: true
    },
  },
};