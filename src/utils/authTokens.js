import crypto from "crypto";
import moment from 'moment'

export const generateVerificationToken = (expiresInMinutes = 60) => {
	const token = crypto.randomBytes(32).toString("hex");
	const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
	const expires = Date.now() + expiresInMinutes * 60 * 1000; // ms
	return { token, tokenHash, expires };
};

export const generatePasswordResetToken = (expiresInMinutes = 60) => {
	const token = crypto.randomBytes(32).toString("hex");
	const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
	const expires = Date.now() + expiresInMinutes * 60 * 1000; // ms
	return { token, tokenHash, expires };
};

// Helper to hash an incoming token for comparison with stored hash
export const hashToken = (token) =>
  	crypto.createHash("sha256").update(token).digest("hex");

export const generateTimeStamp = () => {
  	const timestamp = moment().unix();
  	return timestamp;
};

export default {
	generateVerificationToken,
	generatePasswordResetToken,
	hashToken,
	generateTimeStamp,
};
