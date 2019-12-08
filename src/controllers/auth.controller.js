import EmailSender from "../utils/email/EmailSender";
import VerifyEmailMessage from "../generators/emails/VerifyEmailMessage";

const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../../.env") });

class AuthControllers {
    static async emailVerificationSender(req, res) {
        try {
            // const { email } = req.body;
            const { token } = req.token_detail.created_token.dataValues;
            const _email = VerifyEmailMessage({ token });
            const email_delivery = await EmailSender(_email, {});

            return res.status(200).json({ success: true, email_delivery });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error });
        }
    }
}

export default AuthControllers;
