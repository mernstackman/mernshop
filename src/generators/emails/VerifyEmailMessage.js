const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../../.env") });

/**
 * @param {*} data = Object {}
 * Properties:
 * * sender - Quoted string and unquoted email address
 * * receiver - Email address
 * * subject - String
 * * text - String
 * * html - String of html
 * * url - URL [optional]
 * * token - Generated token [string] (when using test message)
 * */

const VerifyEmailMessage = data => ({
    from: data.sender || `"MERN Stack Email" ${process.env.TEST_SENDER_EMAIL}`, // string - name and email
    to: data.receiver || process.env.TEST_RECEIVER_EMAIL, // string - email
    subject: data.subject || "Confirm Your Email",
    text:
        data.text ||
        `Copy and paste this url in your browser ${process.env.BASE_URL}/${data.url || "auth/email/verify/"}${
            data.token
        }`,
    html:
        data.html ||
        `Click the following link to confirm your email<br>
      <b><a href="${process.env.BASE_URL}/${data.url || "auth/email/verify/"}${data.token}">CONFIRM</a></b>`,
});

export default VerifyEmailMessage;
