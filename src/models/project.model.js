

import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    role: {
        type: String,
        enum: ["PROJECT_ADMIN", "MEMBER"],
        default: "MEMBER",
    },
    },{_id:false})

const ProjectSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "users"
    },
    startDate : {
        type : String,
    },
    attachments : [],
    members : [projectMemberSchema]
}, {timestamps : true});

const ProjectModel = new mongoose.model("user", ProjectSchema);
export default ProjectModel;