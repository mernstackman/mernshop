/* eslint-disable require-atomic-updates */
/* eslint-disable no-unused-vars */

/* Please take a look on routes files for easy controller navigation */

import { FbUser } from "../database/models";
import getApi from "../utils/request/getApi";
const querystring = require("querystring");
const { FB_GRAPH_HOST, FB_APP_ID, FB_APP_SECRET } = process.env;

class FbUsers {
    /* FACEBOOK LOGIN */
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
            // eslint-disable-next-line require-atomic-updates
            const fbTokenData = fbTokenRequest;
            const allResults = { ...req.apiResults, fbTokenData };
            req.apiResults = { ...allResults };

            next();
        } catch (error) {
            return next(error);
        }
    }

    static async getFbUserData(req, res, next) {
        // /v5.0/me?fields=id,name,email
        const { access_token } = req.fbTokenData.access_token ? req.fbTokenData : req.body;
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
    /* { access_token:
   'EAAKfLuRxMZAUBAOik0mKqmMOqns7upIC6Qap0ZAvGtvSkOSQDWZB4imafIqLLP1mMawS9k4zHVPrznlZCclznK4x8J5vA5RIJdO6yyuxnFbZCqLhid80Im4QjgrIk7DjU6IFxq81ZBZBAKDIZA7JZARulIUZCN7Dd8uCxeM54ZBbzpQUQZDZD',
  token_type: 'bearer',
  expires_in: 5183784 }
  
fbUserRequest { id: '503546393594190',
  name: 'Ari Susanto',
  email: 'mernwebdev@gmail.com' } */

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
