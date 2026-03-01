import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { hashToken } from "../utils/authTokens.js";

export const UserRegisterService = async (userData) => {
  try {
    const { firstName, lastName, email, mobileNumber, password } = userData;

    if (!firstName || !lastName || !email || !mobileNumber || !password) {
      throw new Error("All fields are required for registration");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(mobileNumber)) {
      throw new Error("Invalid mobile number format");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await UserModel.findOne({
      email: email,
    });

    const isUserVerified = existingUser?.isUserVerified;

    if (existingUser && isUserVerified) {
      throw new Error("User is already exists with this email, please login");
    } else if (existingUser && !isUserVerified) {
      const updatedUser = await UserModel.updateOne(
        { email: email },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            mobileNumber: mobileNumber,
            password: hashedPassword,
          },
        },
        { upsert: true },
      );

      return { success: true, updatedUser: existingUser };
    } else {
      const newUser = new UserModel({
        firstName,
        lastName,
        email,
        mobileNumber,
        password: hashedPassword,
        forgotPasswordToken: null,
      });

      console.log("New user created in UserRegisterService:", newUser);
      await newUser.save();
      return { success: true, newUser };
    }
  } catch (error) {
    console.log("Error in registering user ", error);
    throw new Error(error.message);
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
        error:
          "Verification token has expired. Please request a new verification email.",
      };
    }

    const tokenHash = hashToken(token);

    if (tokenHash !== user.emailVerificationToken) {
      return { success: false, error: "Invalid verification token" };
    }

    await UserModel.updateOne(
      { email: email },
      {
        $set: {
          isUserVerified: true,
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpiry: null,
        },
      },
    );

    return true;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw new Error(error.message);
  }
};
