import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import {emailVerificationContent,passwordResetContent} from "./mailGenContent.js";
import {generateVerificationToken,generatePasswordResetToken} from "./authTokens.js";

// configure Mailgen once
const mailGenerator = new Mailgen({
	theme: "default",
	product: {
		name: process.env.PROJECT_NAME || "Project Management",
		link: process.env.BACKEND_URL || "http://localhost:6500",
	},
});

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // 587 for STARTTLS
    secure: false, //false for STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // dev only
    },
  });
};

export const sendMail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });
};

export const sendRegistrationEmail = async (user) => {

	try {
		const {token: emailToken,tokenHash: emailHash,expires: emailExpiry} = generateVerificationToken();

		const verificationURL = `${process.env.BACKEND_URL}/users/verify-email?token=${emailToken}&email=${user?.email}`;

		const emailData = emailVerificationContent(user.firstName,user.lastName,verificationURL);

		console.log("Generated email verification content", emailData);
		const html = mailGenerator.generate(emailData);
		const text = mailGenerator.generatePlaintext(emailData);

		// send the mail; if this throws the caller can decide what to do
		await sendMail({
			to: user?.email,
			subject: "Verify your email",
			html,
			text,
		});

    // only store tokens after successful send
    user.emailVerificationToken = emailHash;
    user.emailVerificationExpiry = new Date(emailExpiry);
    const savedUserInEmail = await user.save();

    console.log(
      "User tokens saved successfully in emailService:",
      savedUserInEmail._id,
    );

		// only store tokens after successful send
		user.emailVerificationToken = emailHash;
		user.emailVerificationExpiry = new Date(emailExpiry);
		const savedUserInEmail = await user.save();
		
		console.log("User tokens saved successfully in emailService:", savedUserInEmail._id);

		return { emailToken };
	} catch (error) {
		console.log("Error sending registration email", error);
		throw error.message;
	}
};

export const sendForgotPasswordEmail = async (user, password) => {
  try {
    const {
      token: passwordToken,
      tokenHash: passwordHash,
      expires: passwordExpiry,
    } = generatePasswordResetToken();

    const verificationURL = `${process.env.BACKEND_URL}/users/verify-forgot-password?token=${passwordToken}&email=${user?.email}&password=reset&type=forgot&resetPassword=${password}`;

    const passwordData = passwordResetContent(
      user.firstName,
      user.lastName,
      verificationURL,
    );

    console.log("Generated Password verification content", passwordData);
    const html = mailGenerator.generate(passwordData);
    const text = mailGenerator.generatePlaintext(passwordData);

    // send the mail; if this throws the caller can decide what to do
    await sendMail({
      to: user?.email,
      subject: "Verify your email",
      html,
      text,
    });

    console.log("Password reset email success");

    // only store tokens after successful send
    user.forgotPasswordToken = passwordHash;
    user.emailVerificationExpiry = new Date(passwordExpiry);
    await user.save();

    console.log("User tokens saved successfully in emailService:", user._id);

    return { passwordToken };
  } catch (error) {
    console.log("Error sending forgot password email", error);
    throw error.message;
  }
};
