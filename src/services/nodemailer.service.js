
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
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

export default transporter;