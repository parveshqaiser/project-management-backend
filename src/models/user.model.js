
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    },
    lastName : {
        type : String,
        required : true,
    },
    mobileNumber : {
        type : Number,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    isUserVerified : {
        type : Boolean,
        default : false,
    },
    isEmailVerified : {
        type : Boolean,
        default : false,
    },
    emailVerificationToken : {
        type : String
    },
    emailVerificationExpiry : {
        type : Date
    },
    forgotPasswordToken : {
        type : String,
    },

}, {timestamps : true});

const UserModel = new mongoose.model("users", UserSchema);
export default UserModel