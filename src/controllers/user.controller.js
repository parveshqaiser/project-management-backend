
import UserModel from "../models/user.model.js";
import { hashToken } from "../utils/authTokens.js";
import { UserRegisterService } from "../services/user.service.js";
import { sendRegistrationEmail } from "../utils/emailService.js";

export const userRegistration = async (req, res) => {

	try {

		const result = await UserRegisterService(req.body);

		if (result?.success !== true){
			return res.status(400).json({
				message: "Registration failed",
				success: false,
				error: result?.error,
			});
		}

		res.status(201).json({
			message: "User registered successfully",
			success: true,
			data: result.newUser || result.updatedUser,
		});

    	// Fire email in background
		if (result.newUser){
			sendRegistrationEmail(result.newUser).catch((err) =>
				console.error("Background email failed:", err)
			);
		} else if (result.updatedUser) {
			sendRegistrationEmail(result.updatedUser).catch((err) =>
				console.error("Background updated user email failed:", err)
			);
		}
  	} 
	catch (error) {
    	console.log("Error in registering user ", error);
		res.status(500).json({
    		message: "Some error in registering user",
      		success: false,
      		error: error.message,
    	});
	}
};

export const verifyEmailService = async (email, token) => {
	
	try {
		const user = await UserModel.findOne({ email });

		if (!user) {
			return { success: false, error: "User not found" };
		}

		if (user?.emailVerificationExpiry < Date.now()) {
			return {
				success: false,
				error:"Verification token has expired. Please request a new verification email.",
			};
		}

		const tokenHash = hashToken(token);

		if (tokenHash !== user.emailVerificationToken) {
			return { success: false, error: "Invalid verification token" };
		}

		await UserModel.updateOne({ email: email },{
			$set: {
				isUserVerified: true,
				isEmailVerified: true,
				emailVerificationToken: null,
				emailVerificationExpiry: null,
			},
		});

		return true;
	} catch (error) {
		console.error("Error verifying email:", error);
		throw new Error(error.message);
	}
};
