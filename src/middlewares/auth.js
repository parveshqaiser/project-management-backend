import jwt from "jsonwebtoken";
import { LoginModel } from "../models/user.model.js";

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("authenticateToken called with token:", token)

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const loginUser = jwt.verify(token, process.env.JWT_SECRET);

    console.log("authenticateToken called with loginUser:", loginUser)

    if (!loginUser) {
      return res.status(400).json({
        message: "token expired or invalid",
        success: false,
      });
    }

    req.user = loginUser;

    next();
  } catch (error) {
    console.log("Error in authenticating token", error);
    res
      .status(401)
      .json({ success: false, message: error.message || "Unauthorized" });
  }
};

export const generateAccessToken = async (req, res) => {
  try {

    console.log("generateAccessToken", req.user)
    const payload = req.user;

    const verifyRefreshToken = await jwt.verify(
      payload?.refreshToken,
      process.env.JWT_SECRET,
    );

    if (!verifyRefreshToken) {
      return res.status(400).json({
        message: "token is expired or invalid please login again",
        success: false,
      });
    }

    const accessToken = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    await LoginModel.updateOne(
      { _id: payload?.userId },
      { $set: { accessToken: accessToken, refreshToken: refreshToken } },
    );

    return res.status(200).json({
      message: "Token refreshed successfully",
      success: true,
      token: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log("Error in generating access token", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
