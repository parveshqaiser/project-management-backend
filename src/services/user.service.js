

import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import { checkInputValidation } from "../utils/validation.js";
import validator from "validator";
import { mobileRegex,passwordRegex } from "../utils/constants.js";

export const UserRegisterService = async (userData) => {

    try {
        const { firstName, lastName, email, mobileNumber, password } = userData;

        const requiredError = checkInputValidation(firstName,lastName,email,mobileNumber,password);
    
        if(requiredError) {
            return { 
                success: false, 
                error: requiredError 
            }
        };

        if(!validator.isEmail(email)){
            return { success: false, error: "Invalid email format" };
        }
       
        if (!mobileRegex.test(mobileNumber)) {
            return { success: false, error: "Invalid mobile number format" };
        }

        if (!passwordRegex.test(password)) {
            return {
                success: false,
                error: "Password must be 8+ chars long with upper, lower, number & special",
            };
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const existingUser = await UserModel.findOne({ email });

        if (existingUser && existingUser.isUserVerified) {
            return {
                success: false,
                error: "User already exists with this email, please login",
            };
        }

        if (existingUser && !existingUser.isUserVerified) {
            await UserModel.updateOne({email },{
                $set: {
                    firstName,
                    lastName,
                    mobileNumber,
                    password: hashPassword,
                },
            });

            return { success: true, updatedUser: existingUser };
        }

        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            mobileNumber,
            password: hashPassword,
            forgotPasswordToken: null,
        });

        await newUser.save();

        return { success: true, newUser };
    } 
    catch (error) {
        console.log("Error in registering user", error);
        return { success: false, error: error.message };
    }
};