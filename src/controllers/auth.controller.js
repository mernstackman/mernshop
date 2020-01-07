/* eslint-disable require-atomic-updates */
/* eslint-disable no-unused-vars */

/* Please take a look on routes files for easy controller navigation */

import { User } from "../database/models";
import EmailSender from "../utils/email/EmailSender";
import EmailVerificationMessage from "../generators/emails/EmailVerificationMessage";
import jwt from "jsonwebtoken";
import express_jwt from "express-jwt";

const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../../.env") });

const { SESSION_SECRET, EMAIL_SECRET } = process.env;

/* Write test */
class AuthControllers {
    /* Email Verification Sender */
    static async emailVerificationSender(req, res) {
        try {
            // pass email as the value of receiver property on EmailVerificationMessage method
            let { email: receiver, sender, subject, text, html, url } = req.body;

            const { tokenDetail } = req.apiResults;
            const { token } = tokenDetail && tokenDetail.result;

            const words = { url: url, token: token };
            if (text) {
                text = text.replace(/url|token/g, m => words[m]);
            }
            if (html) {
                html = html.replace(/url|token/g, m => words[m]);
            }

            const _email = EmailVerificationMessage({ receiver, sender, subject, text, html, url, token });

            const email_delivery = await EmailSender(_email, {});

            if (email_delivery.errno) {
                throw email_delivery;
            }

            return res.status(200).json({
                status: 200,
                success: true,
                email_delivery,
                message: "Please check your email inbox or spam folder for verification link.",
            });
        } catch (error) {
            return res.status(400).json({ status: 400, success: false, error: { ...error } });
        }
    }

    static async extractJwt(req, res, next) {
        // const token = await CreateEmailToken({ user_id: 123, email: "merntest@gmail.com" });
        const { token } = req.body;

        try {
            const payload = jwt.verify(token, EMAIL_SECRET);
            // console.log(payload);
            /* { user_id: 123,
                email: 'merntest@gmail.com',
                iat: 1576856254,
                exp: 1576942654 } */
            const jwtToken = { token, payload };
            const allResults = { ...req.apiResults, jwtToken };
            req.apiResults = { ...allResults };

            next();
        } catch (error) {
            // console.log(error);
            /*   {
                    "error": {
                        "name": "TokenExpiredError",
                        "message": "jwt expired",
                        "expiredAt": "2019-12-17T14:28:20.000Z"
                    }
                } */
            return next(error);
        }
    }

    static async setUserEmailStatus(req, res, next) {
        const { user_id } = req.jwtToken.payload || req.body;
        // console.log("setUserEmailStatus", req);

        console.log("setUserEmailStatus", req.jwtToken.payload);
        try {
            const setEmailVerified = await User.update({ email_verified: true }, { where: { user_id } });
            console.log(setEmailVerified);
            return res.status(200).json({
                success: true,
                updated: setEmailVerified,
            });
        } catch (error) {
            return next(error);
        }
    }

    static async getAuth(req) {
        console.log(req.auth);
    }
}

/*
 **************************
 * CHECK ACCESS PERMISSION
 **************************
 * This class' instance property return can be accessed through "req.auth" in the next middleware
 * because the request property is set to "auth"
 *
 * Should be declared outside of class scope because at the time of writing this script,
 * javascript is not supporting class' instance property declaration inside.
 */
AuthControllers.authenticate = express_jwt({
    secret: SESSION_SECRET,
    requestProperty: "auth",
});

export default AuthControllers;
