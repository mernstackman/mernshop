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
            const { token } = req.token_detail.result.token;
            const _email = EmailVerificationMessage({ receiver, token });

            // muted temporarily for development
            // const email_delivery = await EmailSender(_email, {});
            const email_delivery = { _email }; // activate above and mute this to send email

            return res.status(200).json({ success: true, email_delivery });
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
