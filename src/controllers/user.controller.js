
import UserModel from "../models/user.model.js";
import { hashToken } from "../utils/authTokens.js";
import { sendForgotPasswordEmail } from "../utils/emailService.js";

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

export const verifyEmailService = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      throw new Error("Email and token are required for verification");
    }
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

export const forgotPasswordHandler = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email) {
      throw new Error("Email is required for forgot password");
    }

    if (!password || !confirmPassword) {
      throw new Error("Password and confirm password are required");
    }

    if (password !== confirmPassword) {
      throw new Error("Password and confirm password do not match");
    }

    const user = await UserModel.findOne({
      email: email,
      isUserVerified: true,
    });

    if (!user) {
      throw new Error("User not found with this email, please register first");
    }

    res.status(200).json({
      message: "Password reset instructions sent to your email",
      success: true,
    });

    sendForgotPasswordEmail(user).catch((err) =>
      console.error("Forgot-password email failed:", err),
    );
  } catch (error) {
    console.log("Error in forgot password handler:", error);
    throw new Error(error.message);
  }
};

export const verifyForgotPasswordHandler = async (req, res) => {
  try {
    const { token, email, password } = req.query;

    if (!token || !email || !password) {
      throw new Error(
        "Email, token and password are required for verification",
      );
    }

    const user = await UserModel.find({
      email: email,
      isUserVerified: true,
    });

    if (!user) {
      throw new Error("User not found with this email, please register first");
    }

    if (user?.emailVerificationExpiry < Date.now()) {
      throw new Error(
        "Verification token has expired. Please request a new one.",
      );
    }

    const tokenHash = hashToken(token);

    if (tokenHash !== user?.forgotPasswordToken) {
      throw new Error("Invalid forgot password token");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.updateOne(
      { email: email },
      {
        $set: {
          password: hashedPassword,
          forgotPasswordToken: null,
          emailVerificationExpiry: null,
        },
      },
    );

    return true;
  } catch (error) {
    console.log("Error in verifying forgot password:", error);
    throw new Error(error.message);
  }
};
