import jwt from "jsonwebtoken";
import { ONE_HOUR } from "../../constants";
const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../../../.env") });

/**
 * @param {*} data = {user_id, email, username}
 * @param {*} expiration = number - if not supplied, will be set to 12 hours
 * */
const { SESSION_SECRET } = process.env;
const _12H = 12 * ONE_HOUR;

const generateLoginToken = async (data, expiration = _12H) => {
    try {
        const jwtCode = jwt.sign(data, SESSION_SECRET, { expiresIn: expiration, algorithm: "HS512" });

        return jwtCode;
    } catch (error) {
        return;
    }
};

export default generateLoginToken;
