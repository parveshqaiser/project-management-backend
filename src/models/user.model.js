import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isUserVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpiry: {
    type: String,
  },
  forgotPasswordToken: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
});

const UserModel = new mongoose.model("users", UserSchema);

const loginSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // reference to your User model
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

const LoginModel = new mongoose.model("logins", loginSchema);

const UserSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // reference to your User model
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  loginTime: {
    type: String,
  },
  logoutTime: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
const UserSessionModel = new mongoose.model("user-sessions", UserSessionSchema);

export { UserModel, LoginModel, UserSessionModel };
