import express from "express";
import {
  UserRegisterService,
  verifyEmailService,
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
    }else if (result.updatedUser) {
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
    const { token, email } = req.query;

    if(!token || !email){
        throw new Error("Email and token are required for verification")
    }
   
    const result = await verifyEmailService(email, token);

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

export default router;
