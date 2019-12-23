import { Router } from "express";
import Emailtoken from "../../controllers/emailtoken.controller";
import AuthControllers from "../../controllers/auth.controller";
import Users from "../../controllers/user.controller";

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
    AuthControllers.extractJwt,
    Users.getById,
    Users.checkEmailStatus,
    Emailtoken.getByUserId,
    Emailtoken.compare,
    Users.compareEmail,
    AuthControllers.setUserEmailStatus
);

export default router;
