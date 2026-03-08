import {
  UserModel,
  LoginModel,
  UserSessionModel,
} from "../models/user.model.js";
import { hashToken, generateTimeStamp } from "../utils/authTokens.js";
import {
  sendUserCredentials,
  sendPasswordResetEmail,
} from "../helpers/sendUserCredentials.js";
import { passwordRegex, mobileRegex, emailRegex } from "../utils/constants.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { checkInputValidation } from "../utils/validation.js";
import { checkUserExistence } from "../services/user.service.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const userRegistration = async (req, res) => {
  try {
    const { username, firstName, lastName, email, mobileNumber, password } =
      req.body;

    const requiredError = checkInputValidation(
      username,
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
    );

    if (requiredError) {
      return res.status(400).json({
        message: requiredError,
        success: false,
      });
    }

    const isExist = await checkUserExistence(username);

    if (isExist === true) {
      return res.status(400).json({
        message: "Username already exists, please choose another",
        success: false,
      });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", success: false });
    }

    if (!mobileRegex.test(mobileNumber)) {
      return res
        .status(400)
        .json({ message: "Invalid mobile number format", success: false });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars long with upper, lower, number & special",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const existingUser = await UserModel.findOne({ email });

    if (existingUser && existingUser.isUserVerified) {
      return res.status(400).json({
        message: "User already exists with this email, please login",
        success: false,
      });
    }

    if (existingUser && !existingUser.isUserVerified) {
      await UserModel.updateOne(
        { email },
        {
          $set: {
            username: username,
            firstName: firstName,
            lastName: lastName,
            mobileNumber: mobileNumber,
            password: hashPassword,
            updatedAt: generateTimeStamp(),
          },
        },
      );

      res.status(200).json({
        message:
          "User updated successfully. Please check your email for verification.",
        success: true,
        data: existingUser || {},
      });

      sendUserCredentials(existingUser).catch((err) =>
        console.error("Background updated user email failed:", err),
      );
    } else {
      const newUser = new UserModel({
        username: username,
        firstName,
        lastName,
        email,
        mobileNumber,
        password: hashPassword,
        forgotPasswordToken: "",
        createdAt: generateTimeStamp(),
      });

      await newUser.save();

      res.status(201).json({
        message:
          "User registered successfully. Please check your email for verification.",
        success: true,
        data: newUser || {},
      });

      sendUserCredentials(newUser).catch((err) =>
        console.error("Background email failed:", err),
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
};

export const verifyEmailService = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({
        message: "Email and token are required for verification",
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const now = moment().unix();
    if (user?.emailVerificationExpiry < now) {
      return res.status(400).json({
        message:
          "Verification token has expired. Please request a new verification email.",
        success: false,
      });
    }

    const tokenHash = hashToken(token);

    if (tokenHash !== user.emailVerificationToken) {
      return res.status(400).json({
        message: "Invalid verification token",
        success: false,
      });
    }

    await UserModel.updateOne(
      { email: email },
      {
        $set: {
          isUserVerified: true,
          isEmailVerified: true,
          emailVerificationToken: "",
          emailVerificationExpiry: "",
        },
      },
    );

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in verifying email ", error);
    res.status(500).json({
      message: "Some error in verifying email",
      success: false,
      error: error.message,
    });
  }
};

export const forgotPasswordService = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const user = await UserModel.findOne({
      email: email,
      isUserVerified: true,
    });

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars long with upper, lower, number & special",
        success: false,
      });
    }
    {
    }
    if (!user) {
      return res.status(404).json({
        message: "User not found or not verified",
        success: false,
      });
    }

    res.status(200).json({
      message: "password reset link sent to email",
      success: true,
    });

    await sendPasswordResetEmail(user, password).catch((err) => {
      console.error("Background email failed:", err);
      throw new Error("Failed to send password reset email");
    });
  } catch (error) {
    console.log("Error in forgot password ", error);
    res.status(500).json({
      message: "Some error in forgot password",
      success: false,
      error: error.message,
    });
  }
};

export const resetPasswordService = async (req, res) => {
  try {
    const { token, email, hash } = req.query;

    console.log(
      "Received reset password request with token:",
      token,
      "email:",
      email,
      "hash:",
      hash,
    );

    if (!token || !email) {
      return res.status(400).json({
        message: "Email and token are required for verification",
        success: false,
      });
    }

    const user = await UserModel.findOne({
      email: email,
      isUserVerified: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found or not verified",
        success: false,
      });
    }

    const now = moment().unix();

    if (user?.emailVerificationExpiry < now) {
      return res.status(400).json({
        message:
          "Verification token has expired. Please request a new verification email.",
        success: false,
      });
    }

    const tokenHash = hashToken(token);

    if (tokenHash !== user?.forgotPasswordToken) {
      return res.status(400).json({
        message: "Invalid verification token.",
        success: false,
      });
    }

    await UserModel.updateOne(
      { email: email },
      {
        $set: {
          password: hash,
          emailVerificationExpiry: "",
        },
      },
    );

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in verifying email ", error);
    res.status(500).json({
      message: "Some error in verifying email",
      success: false,
      error: error.message,
    });
  }
};

export const changePasswordService = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars long with upper, lower, number & special",
        success: false,
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as old password",
        success: false,
      });
    }

    const user = await UserModel.findOne({
      email: email,
      isUserVerified: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found or incorrect old password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user?.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.updateOne(
      {
        email: email,
      },
      {
        $set: {
          password: hashPassword,
        },
      },
    );

    res.status(200).json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in changing password ", error);
    res.status(500).json({
      message: error?.message || "Some error in changing password",
      success: false,
    });
  }
};

export const userLoginService = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const lastOneHour = moment().subtract(1, "hour").unix();

    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    } else if (user && user?.isUserVerified !== true) {
      return res.status(400).json({
        message:
          "User not verified. Please verify your email before logging in.",
        success: false,
      });
    }

    const userLoginsAttempts = await UserSessionModel.find({
      userId: user?._id,
      status: "failed_password",
      loginTime: { $gte: lastOneHour },
    });

    if (userLoginsAttempts && userLoginsAttempts.length >= 3) {
      return res.status(429).json({
        message: "Too many login attempts. Please try again later.",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      // Save failed attempt with status: "failed_password"
      const failedSession = new UserSessionModel({
        userId: user?._id,
        username: user?.username,
        loginTime: generateTimeStamp(),
        logoutTime: null,
        isActive: false,
        status: "failed_password",
      });

      await failedSession.save();

      return res.status(400).json({
        message: "Invalid password. Please try again.",
        success: false,
      });
    }

    //Only create successful session after password verification
    const userSession = new UserSessionModel({
      userId: user?._id,
      username: user?.username,
      loginTime: generateTimeStamp(),
      logoutTime: null,
      isActive: true,
      status: "success",
    });

    await userSession.save();

    const payload = {
      userId: user?._id || "",
      username: user?.username || "",
      email: user?.email || "",
    };

    const accessToken = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    const isAlreadyLoggedIn = await LoginModel.findOne({ userId: user?._id });

    if (isAlreadyLoggedIn) {
      await LoginModel.updateOne(
        { userId: user?._id },
        {
          $set: {
            token: accessToken,
            refreshToken: refreshToken,
          },
        },
      );
    } else {
      await LoginModel.create({
        userId: user?._id,
        username: user?.username,
        token: accessToken,
        refreshToken: refreshToken,
      });
    }

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log("Error in user login ", error);
    res.status(500).json({
      message: error?.message || "Some error in user login",
      success: false,
    });
  }
};

export const userLogoutService = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }
	
    const { userId, username } = req.user;

    await LoginModel.updateOne(
      { userId: userId },
      {
        $set: {
          token: "",
          refreshToken: "",
        },
      },
    );

    const userLastLogin = await UserSessionModel.findOne({
      userId: userId,
    }).sort({ loginTime: -1 });

    await userLastLogin.updateOne({
      $set: {
        logoutTime: generateTimeStamp(),
        isActive: false,
        status: "logged_out",
      },
    });

    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    console.log("Error in user logout ", error);
    res.status(500).json({
      message: error?.message || "Some error in user logout",
      success: false,
    });
  }
};
