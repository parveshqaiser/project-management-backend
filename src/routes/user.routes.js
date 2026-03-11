import express from "express";
import {
  userRegistration,
  verifyEmailService,
  forgotPasswordService,
  resetPasswordService,
  changePasswordService,
  userLoginService,
  userLogoutService,
} from "../controllers/user.controller.js";
import { generateAccessToken, authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", authenticateToken, userRegistration);
router.get("/verify-email", verifyEmailService);
router.post("/forgot-password", forgotPasswordService);
router.get("/verify-email-forgot-password", resetPasswordService);
router.post("/change-password", changePasswordService);
router.post("/login", userLoginService);
router.get("/refresh-token", generateAccessToken);
router.get("/logout", authenticateToken, userLogoutService);

export default router;
