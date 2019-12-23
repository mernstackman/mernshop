/* eslint-disable no-unused-vars */
/* eslint-disable require-atomic-updates */
import { EmailToken } from "../database/models";
import CreateEmailToken from "../generators/CreateEmailToken";

class Emailtoken {
    static async getByUserId(req, res, next) {
        try {
            let { user_id, ignore } = req.body;

            if (!user_id) {
                user_id = req.jwtToken.payload.user_id;
            }

            console.log(user_id, ignore);
            const rawDetails = await EmailToken.findOne({ where: { user_id } });

            if (!rawDetails && !ignore) {
                throw new Error(`User with ID: ${user_id} has no email token record in database.`);
            }

            if (rawDetails) req.dbToken = rawDetails.dataValues;

            next();
        } catch (error) {
            return next(error);
        }
    }

    /* Compare email tokens from extracted jwt and database */
    static async compare(req, res, next) {
        try {
            if (!req.jwtToken || !req.body || !req.dbToken) {
                throw new Error("One or more required data is not supplied!");
            }

            const { token: outerToken } = req.jwtToken || req.body;
            const { token: dbToken } = req.dbToken;
            console.log(outerToken, dbToken);
            if (outerToken !== dbToken) {
                throw new Error("Invalid token");
            }
            // req.emailTokenMatched = true;
            next();
        } catch (error) {
            return next(error);
        }
    }

    static async storeEmailToken(req, res, next) {
        // console.log(req.body);
        try {
            const token = await CreateEmailToken(req.body);
            const { user_id } = req.body;

            let created_token = {};
            let message = "Token created";

            // Update email token or create new one if not exists
            // req.dbToken is from getByUserId
            if (req.dbToken) {
                const { token_id } = req.dbToken;
                created_token = await EmailToken.update({ token }, { where: { user_id, token_id } });
                message = "Token updated";
            } else {
                created_token = await EmailToken.create({ token, user_id });
            }

            if (!created_token) {
                throw Error("Token cannot be saved to database");
            }

            const token_creation = {
                status: 201,
                success: true,
                error: false,
                result: { token, user_id },
                message,
            };
            req.token_detail = token_creation;
            // return res.status(201).json(token_creation);
            next();
            // return next(token_creation);
        } catch (error) {
            // req.error = { status: 400, success: false, ...error };
            return next(error);
        }
    }
}

export default Emailtoken;
