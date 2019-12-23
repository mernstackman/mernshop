import { Router } from "express";
import Users from "../../controllers/user.controller";

const router = Router();

/*
 *  Create/ define route paths here
 */
router.post("/user/register", Users.register);
router.post("/user/login", Users.login);
// example route for protected area
router.get("/protected", Users.authenticate, Users.getAuth);
router.get("/user/profile", Users.getById);
/* Export router */
export default router;
