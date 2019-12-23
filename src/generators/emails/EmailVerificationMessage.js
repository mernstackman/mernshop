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
 * * token - Generated token [string] [required]
 * */

const EmailVerificationMessage = data => {
    const { sender, receiver, subject, text, html, url, token } = data;

    /* Write test instead of doing the test like these */
    /*   if (testSend == true) {
        sender = `"MERN Stack Email" ${process.env.TEST_SENDER_EMAIL}`;
        receiver = process.env.TEST_RECEIVER_EMAIL;
    } */

    return {
        from: sender, // string - name and email
        to: receiver, // string - email
        subject: subject || "Confirm Your Email",
        text:
            text ||
            `Copy and paste this url in your browser ${process.env.BASE_URL}/${url || "auth/email/verify/"}${token}`,
        html:
            html ||
            `Click the following link to confirm your email<br>
      <b><a href="${process.env.BASE_URL}/${url || "auth/email/verify/"}${token}">CONFIRM</a></b>`,
    };
};

export default EmailVerificationMessage;
