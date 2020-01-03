/* eslint-disable no-unused-vars */
import { FbUser } from "../database/models";

class FbUsers {
    static async storeFbUserData(req, res, next) {
        const { registeredFbUser } = req.apiResults;
        let { user_id } = registeredFbUser;
        if (!user_id && req.body.user_id) {
            user_id = req.body.user_id;
        }
        if (!user_id && req.params.user_id) {
            user_id = req.params.user_id;
        }

        const { access_token, expires_in } = req.apiResults.fbTokenData;

        try {
            const storedFbUser = FbUser.create(user_id, access_token, expires_in);
            const allResults = { ...req.apiResults, storedFbUser };
            req.apiResults = { ...allResults };

            next();
        } catch (error) {
            return next(error);
        }
    }
}

export default FbUsers;
