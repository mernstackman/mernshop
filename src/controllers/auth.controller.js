/* eslint-disable no-unused-vars */
import EmailSender from "../utils/email/EmailSender";
import EmailVerificationMessage from "../generators/emails/EmailVerificationMessage";

const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../../.env") });

class AuthControllers {
    /* Email Verification Sender */
    static async emailVerificationSender(req, res) {
        try {
            // pass email as the value of receiver property on EmailVerificationMessage method
            const { email: receiver } = req.body;
            const { token } = req.token_detail.result;

            /* Write test instead of doing the test like these */
            // Send email using test sender and receiver address. The receiver email address will
            // be replaced with test receiver address because testSend is set to true
            const _email = EmailVerificationMessage({ testSend: true, receiver, token });

            const email_delivery = await EmailSender(_email, {});
            // muted temporarily for development
            // not sending email
            // const email_delivery = { _email }; // uncomment above and comment this to send email

            return res.status(200).json({
                success: true,
                email_delivery,
                message: "Please check your email inbox or spam folder for verification link.",
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error });
        }
    }

    /* User Email Verifier */
    static async userEmailVerifier(req, res, next, token) {
        console.log(token);
    }
}

export default AuthControllers;
