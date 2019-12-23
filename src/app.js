const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../.env") });

import express from "express";
import bodyParser from "body-parser";
import router from "./routes";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

// Define express constant
const app = express();
// Resolve content security policy restrictions
app.use(cors({ origin: [process.env.CALLER_URL] }));
app.use(compression());
app.use(helmet());

// Use body parser middleware
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

/*
 *
 * Router and its next middleware for other use case such as error handling can be defined here
 * Make this as the last part of the app
 *
 */
app.use(router);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // console.log(err);
    return res.status(err.status || 500).json({
        error: {
            message: err.message,
        },
    });
});

// Display html page
app.get("*", (req, res) => {
    res.sendFile(dir.join(__dirname, "./index.html"));
});
export default app;
