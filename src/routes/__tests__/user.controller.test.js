import "core-js";
import "regenerator-runtime/runtime";
import request from "supertest";
import app from "../../app";
import db from "../../database/models";

describe("User controller", () => {
  let server;
  beforeAll(done => {
    // Wake up the server before the test begin
    const port = 8378;
    server = app.listen(port, err => {
      console.log(`Server running at http://localhost:${port}`);
      if (err) return done(err);
      request.agent(server);
      done();
    });
  });

  // Kill the server after all test done
  afterAll(done => {
    return server && server.close(done);
  });

  /*
   * ------------------
   * // REGISTRATION TEST
   * ------------------
   */

  describe("User Registration", () => {
    beforeAll(async done => {
      const { User } = db;
      /* Raw query should be used instead if paranoid is set to true in model definition option */
      /*db.sequelize
        .query("SELECT * FROM `users` WHERE username=testUsername")
        .then(result => {
          console.log(result);
        })
        .catch(e => {
          console.log(e);
        }); */

      // This won't work if paranoid true is defined in the model definition option
      const deleted = await User.destroy({
        where: {
          username: "testUsername"
        }
      });
      console.log(deleted);
      done();
    });

    // user give correct input
    it("Should return status 201 with payload: error = false, user data object, message = Registration success", done => {
      request(app)
        .post("/user/register")
        .send({ username: "testUsername", email: "testUser@email1.com", password: "a1@Bde" })
        .set("Accept", "application/json")
        .end((error, res) => {
          expect(res.status).toEqual(201);
          expect(res.body).toHaveProperty("user_created");
          done();
        });
    });

    /*
     * ---------------------
     * User give wrong input
     * ---------------------
     */
    // username requirements doesn't fulfilled
    // email requirements doesn't fulfilled
    // password requirements doesn't fulfilled
    // unique value already exists
  });
});
