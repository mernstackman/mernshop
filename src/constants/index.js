import jwt from "jsonwebtoken";
/* const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../.env") }); */

module.exports = {
  EMAIL_REGEX: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  ONE_HOUR: 3600000
};
