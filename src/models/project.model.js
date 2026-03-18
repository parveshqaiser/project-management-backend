

import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    email : {
        type : String,
    },
    role: {
        type: String,
        enum: ["project_admin", "member","admin"],
        default: "member",
    },
    },{_id:false}
);

const ProjectSchema = new mongoose.Schema({
    projectCode: {
        type: String,
        required: false,
        default: () => `PR-${Date.now()}`,
        unique: true,
    },
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
        type : Date,
        default : Date.now
    },
    status : {
        type: String,
        required: true,
        default: "Active",
        enum: {
            values: ["Active", "Planning", "Completed", "On Hold", "Cancelled"],
            message: `{VALUE} is not a valid status`
        }
    },
    attachments : [
        {
            url: {
                type: String
            },
            fileName: {
                type: String,
                trim: true
            },
            fileType: {
                type: String, // e.g. "image/png", "application/pdf
            },
            fileSize: {
                type: Number, // in bytes
            },
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            },
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    members : [projectMemberSchema]
}, {timestamps : true});

const ProjectModel = new mongoose.model("projects", ProjectSchema);
export default ProjectModel;