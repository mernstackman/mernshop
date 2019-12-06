import nodemailer from "nodemailer";

const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../../.env") });

/**
 *
 * @param {*} sender : object { email, password, host, port }
 *
 * @param {*} emaildata : object { from, to, subject, text, html }
 *  from: sender name and email address - [string]
 *  to: destination email address
 *  subject: email message title
 *  text: raw text message to show in case receiver email does not support html
 *  html: html formatted message
 * */

const EmailSender = async (sender, emaildata) => {
    const { email, password, host, port } = await sender;

    const credentials = {
        host: host || process.env.EMAIL_HOST,
        port: port || process.env.EMAIL_PORT,
        secure: this.port === 465, // true for 465, false for other ports
        auth: {
            user: email || process.env.EMAIL_ADDRESS, // generated ethereal user
            pass: password || process.env.EMAIL_PASSWORD, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false,
        },
    };

    const transporter = nodemailer.createTransport(credentials);

    try {
        const send_email = await transporter.sendMail(emaildata);
        return Promise.resolve(send_email);
    } catch (error) {
        return Promise.reject(error);
    }
};

export default EmailSender;
