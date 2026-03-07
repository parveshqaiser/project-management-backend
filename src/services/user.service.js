import { UserModel } from "../models/user.model.js";

export const checkUserExistence = async (value) => {
  try {
    const existingUser = await UserModel.find({ username: value });

    if (existingUser && existingUser?.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error in checking user existence", error);
    throw new Error("Error in checking user existence:",error.message)
  }
};
