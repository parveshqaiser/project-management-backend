
import express from "express";
import {userRegistration,verifyEmailService} from "../controllers/user.controller.js";


const router = express.Router();

router.post("/register", userRegistration);

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