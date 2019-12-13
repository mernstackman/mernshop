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
    /* Write test instead of doing the test like these */
    let { sender, receiver, testSend } = data;

    if (testSend == true) {
        sender = `"MERN Stack Email" ${process.env.TEST_SENDER_EMAIL}`;
        receiver = process.env.TEST_RECEIVER_EMAIL;
    }

    return {
        from: sender, // string - name and email
        to: receiver, // string - email
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
    };
};

export default EmailVerificationMessage;
