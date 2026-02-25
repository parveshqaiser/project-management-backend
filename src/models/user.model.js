
import mongoose from "mongoose";
import crypto from "node:crypto";
import bcrypt from "bcrypt";

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
    password : {
        type : String,
        required : [true, "Password Required"],
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
    isEmailVerified : {
        type : Boolean,
        default : false,
    },
    refreshToken : {
        type : String,
        default:null,
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

UserSchema.methods.isPasswordCorrect = async function (pwd) {
    return await bcrypt.compare(pwd , this.password)
}

UserSchema.methods.generateTemporaryToken = function(){
    let unhasedToken = crypto.randomBytes(10).toString("hex");

    let hashedToken = crypto.createHash("sha256").update(unhasedToken).digest("hex");
    let tokenExpiry = Date.now() + (10*60*1000); // for 10 mins

    return {unhasedToken, hashedToken , tokenExpiry}
}

const UserModel = new mongoose.model("user", UserSchema);
export default UserModel;