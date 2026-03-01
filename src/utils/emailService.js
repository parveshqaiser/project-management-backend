import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import {
  emailVerificationContent,
  passwordResetContent,
} from "./mailGenContent.js";
import {
  generateVerificationToken,
  generatePasswordResetToken,
} from "./authTokens.js";

// configure Mailgen once
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: process.env.PROJECT_NAME || "Project Management",
    link: process.env.BACKEND_URL || "http://localhost:6500",
  },
});

const createTransporter = () => {
  console.log("Creating email transporter with config", {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
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
  console.log("Sending email to", to, "with subject", subject);
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
    const {
      token: emailToken,
      tokenHash: emailHash,
      expires: emailExpiry,
    } = generateVerificationToken();

    const verificationURL = `${process.env.BACKEND_URL}/users/verify-email?token=${emailToken}&email=${user?.email}`;

    const emailData = emailVerificationContent(
      user.firstName,
      user.lastName,
      verificationURL,
    );

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

    console.log("email success");

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
