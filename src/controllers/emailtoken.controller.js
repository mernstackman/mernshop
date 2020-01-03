/* eslint-disable no-unused-vars */
/* eslint-disable require-atomic-updates */
import { EmailToken } from "../database/models";
import { CreateEmailToken } from "../generators/token";

class Emailtoken {
    static async getByUserId(req, res, next) {
        const { jwtToken } = req.apiResults;
        let { user_id } = await req.params;

        if (!user_id && req.body.user_id) {
            user_id = await req.body.user_id;
        }

        if (!user_id && jwtToken && jwtToken.payload) {
            user_id = await jwtToken.payload.user_id;
        }

        try {
            const rawDetails = await EmailToken.findOne({ where: { user_id } });
            const { ignore } = req.body;

            // If no result and don't ignore error -> throw Error
            if (!rawDetails && !ignore) {
                throw new Error(`User with ID: ${user_id} has no email token record in database.`);
            }

            if (rawDetails) {
                const dbToken = rawDetails.dataValues;
                const allResults = await { ...req.apiResults, dbToken };
                req.apiResults = { ...allResults };
            }

            next();
        } catch (error) {
            return next(error);
        }
    }

    /* Compare email tokens from extracted jwt and database */
    static async compare(req, res, next) {
        const { jwtToken, dbToken } = req.apiResults;
        try {
            if (!jwtToken || !req.body || !dbToken) {
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
            const tokenDetail = token_creation;
            const allResults = { ...req.apiResults, tokenDetail };
            req.apiResults = { ...allResults };
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
