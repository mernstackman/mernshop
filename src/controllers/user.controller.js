import { User } from "../database/models";
import { EMAIL_REGEX, ONE_HOUR } from "../constants";
import jwt from "jsonwebtoken";
import express_jwt from "express-jwt";

const dir = require("path");
require("dotenv").config({ path: dir.join(__dirname, "../../.env") });

class UserControllers {
  /*
   ****************
   * REGISTER USER
   ****************
   */
  static async register(req, res, next) {
    const { username, email, password } = req.body;
    try {
      const user_created = await User.create({ username, email, password });

      if (user_created) {
        // send confirmation email
      }
      return res.status(201).json({ error: false, user_created, message: "Registration success" });
    } catch (error) {
      // return next(error);
      return res.status(400).json(error);
    }
  }

  /*
   ****************
   * LOGIN USER
   ****************
   */
  static async login(req, res, next) {
    /* Initialize login */
    let user_identifier = {};
    let identity = "";
    if (EMAIL_REGEX.test(req.body.user)) {
      user_identifier = { email: req.body.user };
      identity = "email";
    } else {
      user_identifier = { username: req.body.user };
      identity = "username";
    }

    /* Trying to login user */
    try {
      const user = await User.findOne({ where: user_identifier });
      const password_correct = await user.verifyPassword(req.body.password);
      if (!password_correct) {
        return res.status(401).json({ error: true, message: `${identity} and password not match` });
      }

      // generate jwt
      const expiration = 6 * ONE_HOUR;
      const { user_id, email, username } = await user.dataValues;
      const jwtCode = jwt.sign(
        {
          user_id,
          email,
          username
        },
        process.env.SESSION_SECRET,
        { expiresIn: expiration, algorithm: "HS512" }
      );

      // store jwt to user cookies and output user data
      const data = await user.getSafeDataValues();
      return res
        .status(200)
        .cookie("log_id", "Bearer " + jwtCode, {
          httpOnly: true,
          expires: new Date(Date.now + expiration)
        })
        .json({ error: false, data, message: { text: "Login success", jwtCode } });
    } catch (error) {
      return next(error);
    }
  }

  static async getAuth(req) {
    console.log(req.auth);
  }
}

/*
 **************************
 * CHECK ACCESS PERMISSION
 **************************
 * This class' instance property return can be accessed through "req.auth" in the next middleware
 * because the request property is set to "auth"
 *
 * Should be declared outside of class scope because at the time of writing this script,
 * javascript is not supporting class' instance property declaration inside.
 */
UserControllers.authenticate = express_jwt({
  secret: process.env.SESSION_SECRET,
  requestProperty: "auth"
});

export default UserControllers;
