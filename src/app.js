import express from "express";
import bodyParser from "body-parser";
import router from "./routes";

// Define express constant
const app = express();

// Use body parser middleware
app.use(
  bodyParser.urlencoded({
    extended: true
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

export default app;
