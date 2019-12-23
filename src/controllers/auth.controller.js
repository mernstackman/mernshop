/* eslint-disable no-unused-vars */
import { User } from "../database/models";
import EmailSender from "../utils/email/EmailSender";
import EmailVerificationMessage from "../generators/emails/EmailVerificationMessage";
import jwt from "jsonwebtoken";

const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../../.env") });

/* Write test */
class AuthControllers {
    /* Email Verification Sender */
    static async emailVerificationSender(req, res) {
        try {
            // pass email as the value of receiver property on EmailVerificationMessage method
            const { email: receiver } = req.body;
            const { token } = req.token_detail.result;

            const _email = EmailVerificationMessage({ receiver, token });

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
            const payload = jwt.verify(token, process.env.EMAIL_SECRET);
            // console.log(payload);
            /* { user_id: 123,
                email: 'merntest@gmail.com',
                iat: 1576856254,
                exp: 1576942654 } */
            req.jwtToken = { token, payload };
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
}

export default AuthControllers;
