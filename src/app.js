import express from "express";
import bodyParser from "body-parser";

// Define express constant
const app = express();

// Use body parser middleware
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

export default app;
