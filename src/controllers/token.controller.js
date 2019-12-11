/* eslint-disable require-atomic-updates */
import { EmailToken } from "../database/models";
import CreateEmailToken from "../generators/CreateEmailToken";

class TokenControllers {
    static async storeEmailToken(req, res, next) {
        // console.log(req);
        try {
            const token = await CreateEmailToken(req.body);
            const { user_id } = req.body;

            const findByFK = await EmailToken.findOne({ where: { user_id } });
            let created_token = {};
            let message = "Token created";

            if (findByFK) {
                const { token_id } = findByFK.dataValues;
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

export default TokenControllers;
