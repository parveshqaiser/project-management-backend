
import express from "express";
import {
  UserRegisterService,
  verifyEmailService,
  forgotPasswordHandler,
  verifyForgotPasswordHandler,
} from "../controllers/user.controller.js";
import { sendRegistrationEmail } from "../utils/emailService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("User data is required for registration");
    }
    const result = await UserRegisterService(req.body);

    if (result?.success !== true) {
      return res.status(400).json({
        message: "Registration failed",
        success: false,
        error: result.error,
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: result.newUser || result.updatedUser,
    });

    // Send email in background (don't await, just fire it off)
    if (result.newUser) {
      sendRegistrationEmail(result.newUser).catch((err) =>
        console.error("Background email failed:", err),
      );
    } else if (result.updatedUser) {
      sendRegistrationEmail(result.updatedUser).catch((err) =>
        console.error("Background updated user email failed:", err),
      );
    }
  } catch (error) {
    console.log("Error in registering user ", error);
    res.status(500).json({
      message: "Some error in registering user",
      success: false,
      error: error.message,
    });
  }
});

router.get("/verify-email", async (req, res) => {
  try {
    const result = await verifyEmailService(req, res);

    if (result === true) {
      res.json({
        message: "Email verified successfully",
        success: true,
      });
    } else {
      res.status(400).json({
        message: "Email verification failed",
        success: false,
      });
    }
  } catch (error) {
    console.log("Error in verifying email ", error);
    res.status(500).json({
      message: "Some error in verifying email",
      success: false,
      error: error.message,
    });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const result = await forgotPasswordHandler(req, res);

    if (result) {
      res.json({
        message: "Password reset instructions sent to your email",
        success: true,
      });
    } else {
      res.status(400).json({
        message: "Failed to process forgot password request",
        success: false,
      });
    }
  } catch (error) {
    console.log("Error in forgot password ", error);
    res.status(500).json({
      message: "Some error in processing forgot password request",
      success: false,
      error: error.message,
    });
  }
});

router.get("/verify-forgot-password", async (req, res) => {
  try {
    const result = await verifyForgotPasswordHandler(req, res);
    if(result) {
      res.json({
        message: "Password reset verified successfully",
        success: true,
      });
    }else{
      res.status(400).json({
        message: "Failed to verify forgot password request",
        success: false,
      })
    }
  } catch (error) {
    console.log("Error in verifying forgot password ", error);
    res.status(500).json({
      message:
        error.message || "Some error in verifying forgot password request",
      success: false,
    });
  }
});

export default router;
