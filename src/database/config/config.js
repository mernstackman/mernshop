const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../../.env") });

module.exports = {
  development: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false
  },
  test: {
    use_env_variable: "TEST_DB_URL",
    database: process.env.TEST_DB_NAME,
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASS,
    host: process.env.TEST_DB_HOST,
    dialect: "mysql",
    logging: false
  },
  production: {
    use_env_variable: "DB_URL",
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    // url: process.env.DB_URL,
    dialect: "mysql",
    logging: false
  }
};
