/* eslint-disable require-atomic-updates */
/* eslint-disable no-unused-vars */

/* Please take a look on routes files for easy controller navigation */

import { FbUser } from "../database/models";
import getApi from "../utils/request/getApi";
const querystring = require("querystring");
const { FB_GRAPH_HOST, FB_APP_ID, FB_APP_SECRET } = process.env;

class FbUsers {
    /* FACEBOOK LOGIN */

    /* Inspect Token */
    static async inspectToken(req, res, next) {
        const { access_token } = req.body;
        const hostname = `${FB_GRAPH_HOST}`;
        const path = "/v5.0/oauth/debug_token?";
        const params = {
            input_token: access_token,
            access_token: `${FB_APP_ID}|${FB_APP_SECRET}`,
        };
        const query_arguments = querystring.stringify(params);
        const headers = { "Content-Type": "application/x-www-form-urlencoded" };

        // Options
        const options = {
            hostname,
            port: 443,
            path: `${path}${query_arguments}`,
            headers,
        };

        try {
            const fbTokenInspection = await getApi(options);
            const tokenInspection = { ...fbTokenInspection.data };
            const allResults = { ...req.apiResults, tokenInspection };
            req.apiResults = { ...allResults };

            next();
        } catch (error) {
            return next(error);
        }
    }

    /* Compare App Id */
    static async compareAppId(req, res, next) {
        try {
            const { app_id } = await req.apiResults.tokenInspection;
            if (app_id.toString() !== FB_APP_ID) {
                throw new Error("The supplied token is not for current application");
            }
            next();
        } catch (error) {
            return next(error);
        }
    }

    static async getDataFromToken(req, res, next) {
        // /v5.0/me?fields=id,name,email
        const { fbTokenData } = req.apiResults;
        const { access_token } = fbTokenData && fbTokenData.access_token ? fbTokenData : req.body;
        const hostname = `${FB_GRAPH_HOST}`;
        const path = "/v5.0/me?";
        const params = {
            fields: "id, first_name, last_name, email",
            access_token,
        };
        const query_arguments = querystring.stringify(params);
        const headers = { "Content-Type": "application/x-www-form-urlencoded" };
        // Options
        const options = {
            hostname,
            port: 443,
            path: `${path}${query_arguments}`,
            headers,
        };

        try {
            const fbUserRequest = await getApi(options);
            console.log("fbUserRequest", fbUserRequest);
            if (fbUserRequest.error) {
                throw fbUserRequest.error;
            }
            // eslint-disable-next-line require-atomic-updates
            const fbUserData = fbUserRequest;
            const allResults = { ...req.apiResults, fbUserData };
            req.apiResults = { ...allResults };

            next();
        } catch (error) {
            return next(error);
        }
    }

    static async extendToken(req, res, next) {
        // Exchange with long term access_token
        const { fbtoken } = req.body;
        const hostname = `${FB_GRAPH_HOST}`;
        const path = "/v5.0/oauth/access_token?";
        const params = {
            grant_type: "fb_exchange_token",
            client_id: FB_APP_ID,
            client_secret: FB_APP_SECRET,
            fb_exchange_token: fbtoken,
        };
        const query_arguments = querystring.stringify(params);
        const headers = { "Content-Type": "application/x-www-form-urlencoded" };

        // Options
        const options = {
            hostname,
            port: 443,
            path: `${path}${query_arguments}`,
            headers,
        };

        try {
            const fbTokenRequest = await getApi(options);
            console.log(fbTokenRequest);
            if (fbTokenRequest.error) {
                throw fbTokenRequest.error;
            }

            const fbTokenData = fbTokenRequest;
            const allResults = { ...req.apiResults, fbTokenData };
            req.apiResults = { ...allResults };

            next();
        } catch (error) {
            return next(error);
        }
    }

    /* { access_token:
   'EAAKfLuRxMZAUBAOik0mKqmMOqns7upIC6Qap0ZAvGtvSkOSQDWZB4imafIqLLP1mMawS9k4zHVPrznlZCclznK4x8J5vA5RIJdO6yyuxnFbZCqLhid80Im4QjgrIk7DjU6IFxq81ZBZBAKDIZA7JZARulIUZCN7Dd8uCxeM54ZBbzpQUQZDZD',
  token_type: 'bearer',
  expires_in: 5183784 }
  
fbUserRequest { id: '503546393594190',
  name: 'Ari Susanto',
  email: 'mernwebdev@gmail.com' } */

    static async storeData(req, res, next) {
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

    /* LOGIN FB USER */
    /* Store facebook token to user's browser cookies */

    static async login(req, res, next) {
        try {
            const { registeredFbUser, storedFbUser } = await req.apiResults;
            let { fbToken } = await storedFbUser.access_token;

            return res
                .status(200)
                .cookie("fblog_id", "Bearer " + fbToken, {
                    httpOnly: true,
                })
                .json({
                    success: true,
                    data: { ...registeredFbUser, ...storedFbUser },
                    message: "Facebook login succeed!",
                });
        } catch (error) {
            return next(error);
        }
    }
}

export default FbUsers;
