/* eslint-disable require-atomic-updates */
import { EmailToken } from "../database/models";
import CreateEmailToken from "../generators/CreateEmailToken";

class TokenControllers {
    static async storeEmailToken(req, res, next) {
        // console.log(req);
        try {
            const token = await CreateEmailToken(req.body);
            const { user_id } = req.body;
            const created_token = await EmailToken.create({ token, user_id });

            const token_creation = {
                status: 201,
                success: true,
                error: false,
                created_token,
                message: "Token created",
            };
            req.token_detail = token_creation;
            next();
            // return next(token_creation);
        } catch (error) {
            // req.error = { status: 400, success: false, ...error };
            return next(error);
        }
    }
}

export default TokenControllers;
