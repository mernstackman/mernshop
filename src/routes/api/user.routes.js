import { Router } from "express";
import UserControllers from "../../controllers/user.controller";

const router = Router();

/*
 *  Create/ define route paths here
 */
router.post("/user/register", UserControllers.register);
router.post("/user/login", UserControllers.login);
// example route for protected area
router.get("/protected", UserControllers.authenticate, UserControllers.getAuth);

/* Export router */
export default router;
