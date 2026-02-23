
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
    },
    email : {
        type : String,
        required : true,
        index : true,
        unique : true
    },
    // role : {
    //     type : String,
    //     default : "member",
    //     enum : ["admin", "project_admin", "member"]
    // },
    isUserVerified : {
        type : Boolean,
        default : false,
    },
    otp : {
        type : Number,
    },
    otpExpiry : {
        type : String,
    },
    refreshToken : {
        type : String,
        default:null,
    },
}, {timestamps : true});

const UserModel = new mongoose.model("user", UserSchema);
export default UserModel;