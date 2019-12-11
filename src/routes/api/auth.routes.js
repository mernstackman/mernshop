import { Router } from "express";
import TokenControllers from "../../controllers/token.controller";
import AuthControllers from "../../controllers/auth.controller";

const router = Router();

// Create token and then send confirmation email
router.post("/auth/email/send/verification", TokenControllers.storeEmailToken, AuthControllers.emailVerificationSender);

// Check token and verify user email
router.get("/auth/email/verify/:token", AuthControllers.userEmailVerifier);
export default router;
