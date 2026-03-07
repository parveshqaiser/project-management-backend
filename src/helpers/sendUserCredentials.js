import { sendUserMail } from "../services/nodemailer.service.js";
import {
  emailVerificationTemplate,
  passwordResetContentTemplate,
} from "../services/template.service.js";
import { generateVerificationToken ,generatePasswordResetToken} from "../utils/authTokens.js";
import bcrypt from "bcrypt";
import moment from "moment"

export const sendUserCredentials = async (user) => {
  try {
    const email = user?.email || "";
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";

    const {
      token: emailToken,
      tokenHash: emailHash,
      expires: emailExpiry,
    } = generateVerificationToken();

    const verificationURL = `${process.env.BACKEND_URL}/api/v1/auth/verify-email?token=${emailToken}&email=${user?.email}`;

    let html = emailVerificationTemplate(firstName, lastName, verificationURL);

    await sendUserMail({
      to: email,
      subject: "Verify your email",
      html,
    });

    const addOneHour = moment().add(1, "hour").unix();

    // only store tokens after successful send
    user.emailVerificationToken = emailHash;
    user.emailVerificationExpiry = addOneHour;
    await user.save();

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return { success: false, message: "Failed to send email" };
  }
};

export const sendPasswordResetEmail = async (user, password) => {
  try {
    const email = user?.email || "";
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";

    const {
      token: passwordResetToken,
      tokenHash: passwordResetHash,
      expires: passwordResetExpiry,
    } = generatePasswordResetToken();

    const hashPassword = await bcrypt.hash(password, 10);

    const verificationURL = `${process.env.BACKEND_URL}/api/v1/auth/verify-email-forgot-password?token=${passwordResetToken}&email=${email}&hash=${hashPassword}`;

    let html = passwordResetContentTemplate(firstName, lastName, verificationURL);

    await sendUserMail({
      to: email,
      subject: "Reset your password",
      html,
    });

    console.log("Password reset email sent successfully to", email);

    const addOneHour = moment().add(1, "hour").unix();

    // only store tokens after successful send
    user.forgotPasswordToken = passwordResetHash;
    user.emailVerificationExpiry = addOneHour;
    await user.save();

    console.log("User tokens saved successfully in password reset email:", user._id);

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, message: "Failed to send email" };
  }
};
