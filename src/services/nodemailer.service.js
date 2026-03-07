
import nodemailer from "nodemailer";
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


export const sendUserMail = async ({ to, subject, html }) => {
	const transporter = createTransporter();
	console.log("Sending email to", to, "with subject", subject);
	return transporter.sendMail({
		from: process.env.EMAIL_FROM,
		to,
		subject,
		html
	});
};