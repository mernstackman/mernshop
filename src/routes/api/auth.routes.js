import { Router } from "express";
import global from "../../controllers";
import Emailtoken from "../../controllers/emailtoken.controller";
import AuthControllers from "../../controllers/auth.controller";
import Users from "../../controllers/user.controller";
import FbUsers from "../../controllers/fbuser.controller";
// import FbUsers from "../../controllers/fbuser.controller";

const router = Router();

// Create token and then send confirmation email
router.post(
    "/auth/email/send/verification",
    Emailtoken.getByUserId,
    Emailtoken.storeEmailToken,
    AuthControllers.emailVerificationSender
);

// Check token and verify user email
router.post(
    "/auth/email/validate",
    global.initApiResults,
    AuthControllers.extractJwt,
    Users.getById,
    Users.checkEmailStatus,
    Emailtoken.getByUserId,
    Emailtoken.compare,
    Users.compareEmail,
    AuthControllers.setUserEmailStatus
);

router.post("/auth/login", global.initApiResults, Users.login);

router.post(
    "/auth/facebook",
    global.initApiResults,
    FbUsers.inspectToken,
    FbUsers.compareAppId,
    FbUsers.getDataFromToken,
    FbUsers.extendToken,
    Users.registerFromFb,
    FbUsers.storeData,
    FbUsers.login
);

// example route for protected area
// router.get("/protected", AuthControllers.authenticate, AuthControllers.getAuth);

/* For testing purpose only */
router.get("/test", global.initApiResults, global.testApi);

export default router;
