/* eslint-disable require-atomic-updates */
/* eslint-disable no-unused-vars */

/* Please take a look on routes files for easy controller navigation */

import { User } from "../database/models";
const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../.env") });

class Users {
    static async getById(req, res, next) {
        // or req.params.user_id (if /:user_id) or req.query.user_id (if ?user_id={user-id})
        const { jwtToken } = req.apiResults;
        let { user_id } = await req.params;

        if (!user_id && req.body.user_id) {
            user_id = await req.body.user_id;
        }

        if (!user_id && jwtToken && jwtToken.payload) {
            user_id = await jwtToken.payload.user_id;
        }

        try {
            const userDetails = await User.findByPk(user_id);
            if (!userDetails) {
                throw new Error("No user found!");
            }

            const userData = await userDetails.getSafeDataValues();
            const allResults = await { ...req.apiResults, userData };
            req.apiResults = { ...allResults };

            next();
        } catch (error) {
            return next(error);
        }
    }

    static async checkEmailStatus(req, res, next) {
        let emailStatus = false;
        const { userData } = await req.apiResults;

        try {
            if (userData) {
                emailStatus = await userData.email_verified;
            }

            // if email status is already verified (email_verified = true)
            if (emailStatus) {
                throw new Error("Email is already verified!");
            }

            next();
        } catch (error) {
            return next(error);
        }
    }

    static async compareEmail(req, res, next) {
        const { jwtToken, userData } = req.apiResults;

        try {
            if (!jwtToken || !req.body || !userData) {
                throw new Error("One or more required data is not supplied!");
            }

            const { email: outerEmail } = (jwtToken && jwtToken.payload) || req.body;
            const { email: dbEmail } = userData;
            console.log(outerEmail, dbEmail);

            if (outerEmail !== dbEmail) {
                throw new Error("Invalid email");
            }
            // req.emailAddressMatched = true;
            next();
        } catch (error) {
            return next(error);
        }
    }

    /*
     ****************
     * REGISTER USER
     ****************
     */
    static async register(req, res) {
        const { username, email, password } = req.body;
        try {
            if (!username) {
                throw new Error("Username is required");
            }
            if (!password) {
                throw new Error("Password is required");
            }
            const user_created = await User.create({ username, email, password });
            const signup_data = await user_created.getSafeDataValues();

            return res.status(201).json({
                status: 201,
                success: true,
                error: false,
                signup_data,
                message: "Registration success",
            });
        } catch (error) {
            // return next(error);
            // console.log(error);
            return res.status(400).json({ status: 400, success: false, ...error });
        }
    }

    static async registerUserFromFb(req, res, next) {
        // {user-id}/picture?type=large
        const fbUserDetails = { ...req.apiResults.fbTokenData, ...req.apiResults.fbUserData };
        const { first_name, last_name, email } = fbUserDetails;

        try {
            const CreateFbUser = await User.create({ first_name, last_name, email, email_verified: true });
            const registeredFbUser = CreateFbUser.getSafeDataValues();
            const allResults = { ...req.apiResults, registeredFbUser };
            req.apiResults = { ...allResults };

            next();
        } catch (error) {
            return res.status(400).json({ status: 400, success: false, ...error });
        }
    }
}

export default Users;
