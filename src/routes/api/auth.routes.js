import { Router } from "express";
import TokenControllers from "../../controllers/token.controller";
import AuthControllers from "../../controllers/auth.controller";

const router = Router();

router.post("/auth/email/send/verification", TokenControllers.storeEmailToken, AuthControllers.emailVerificationSender);

export default router;
