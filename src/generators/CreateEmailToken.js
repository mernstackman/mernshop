/* eslint-disable no-undef */
import jwt from "jsonwebtoken";

const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../../.env") });

/**
 * @param {*} data = {user_id, email}
 * */

const CreateEmailToken = async data => {
    try {
        const token = await jwt.sign(data, process.env.EMAIL_SECRET, { expiresIn: "24h" }, { algorithm: "HS512" });
        return token;
    } catch (error) {
        return error;
    }
};

export default CreateEmailToken;
