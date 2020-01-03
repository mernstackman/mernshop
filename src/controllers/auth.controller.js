/* eslint-disable require-atomic-updates */
/* eslint-disable no-unused-vars */
import { User } from "../database/models";
import EmailSender from "../utils/email/EmailSender";
import EmailVerificationMessage from "../generators/emails/EmailVerificationMessage";
import jwt from "jsonwebtoken";
import { EMAIL_REGEX, ONE_HOUR } from "../constants";
import express_jwt from "express-jwt";
import getApi from "../utils/request/getApi";
import { generateLoginToken } from "../generators/token";
const querystring = require("querystring");
const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../../.env") });

const { FB_GRAPH_HOST, FB_APP_ID, FB_APP_SECRET, SESSION_SECRET, EMAIL_SECRET } = process.env;

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

    /*
     ****************
     * LOGIN USER
     ****************
     */
    static async login(req, res, next) {
        /* Initialize login */
        let user_identifier = {};
        let identity = "";
        if (EMAIL_REGEX.test(req.body.user)) {
            user_identifier = { email: req.body.user };
            identity = "email";
        } else {
            user_identifier = { username: req.body.user };
            identity = "username";
        }

        /* Trying to login user */
        try {
            const user = await User.findOne({ where: user_identifier });
            const password_correct = await user.verifyPassword(req.body.password);
            if (!password_correct) {
                // return res.status(401).json({ error: true, message: `${identity} and password not match` });
                throw new Error(`${identity} and password not match`);
            }

            // generate jwt
            const expiration = 6 * ONE_HOUR;
            const data = await user.getSafeDataValues();
            const { user_id, email, username } = data;
            const jwtCode = await generateLoginToken({ user_id, email, username });

            // store jwt to user cookies and output user data
            return res
                .status(200)
                .cookie("log_id", "Bearer " + jwtCode, {
                    httpOnly: true,
                    expires: new Date(Date.now + expiration),
                })
                .json({
                    error: false,
                    data,
                    message: { text: "Login success", jwtCode },
                });
        } catch (error) {
            return next(error);
        }
    }

    /* FACEBOOK LOGIN */
    static async extendToken(req, res, next) {
        // Exchange with long term access_token
        const { fbtoken } = req.body;
        const hostname = `${FB_GRAPH_HOST}`;
        const path = "/v5.0/oauth/access_token?";
        const params = {
            grant_type: "fb_exchange_token",
            client_id: FB_APP_ID,
            client_secret: FB_APP_SECRET,
            fb_exchange_token: fbtoken,
        };
        const query_arguments = querystring.stringify(params);
        const headers = { "Content-Type": "application/x-www-form-urlencoded" };

        // Options
        const options = {
            hostname,
            port: 443,
            path: `${path}${query_arguments}`,
            headers,
        };

        try {
            const fbTokenRequest = await getApi(options);
            console.log(fbTokenRequest);
            if (fbTokenRequest.error) {
                throw fbTokenRequest.error;
            }
            // eslint-disable-next-line require-atomic-updates
            const fbTokenData = fbTokenRequest;
            const allResults = { ...req.apiResults, fbTokenData };
            req.apiResults = { ...allResults };

            next();
        } catch (error) {
            return next(error);
        }
    }

    static async getFbUserData(req, res, next) {
        // /v5.0/me?fields=id,name,email
        const { access_token } = req.fbTokenData.access_token ? req.fbTokenData : req.body;
        const hostname = `${FB_GRAPH_HOST}`;
        const path = "/v5.0/me?";
        const params = {
            fields: "id, first_name, last_name, email",
            access_token,
        };
        const query_arguments = querystring.stringify(params);
        const headers = { "Content-Type": "application/x-www-form-urlencoded" };
        // Options
        const options = {
            hostname,
            port: 443,
            path: `${path}${query_arguments}`,
            headers,
        };

        try {
            const fbUserRequest = await getApi(options);
            console.log("fbUserRequest", fbUserRequest);
            if (fbUserRequest.error) {
                throw fbUserRequest.error;
            }
            // eslint-disable-next-line require-atomic-updates
            const fbUserData = fbUserRequest;
            const allResults = { ...req.apiResults, fbUserData };
            req.apiResults = { ...allResults };

            next();
        } catch (error) {
            return next(error);
        }
    }
    /* { access_token:
   'EAAKfLuRxMZAUBAOik0mKqmMOqns7upIC6Qap0ZAvGtvSkOSQDWZB4imafIqLLP1mMawS9k4zHVPrznlZCclznK4x8J5vA5RIJdO6yyuxnFbZCqLhid80Im4QjgrIk7DjU6IFxq81ZBZBAKDIZA7JZARulIUZCN7Dd8uCxeM54ZBbzpQUQZDZD',
  token_type: 'bearer',
  expires_in: 5183784 }
  
fbUserRequest { id: '503546393594190',
  name: 'Ari Susanto',
  email: 'mernwebdev@gmail.com' } */
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
