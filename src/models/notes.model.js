
import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    content : {
        type : String,
        required : true,
    },
    projectId: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "projects"
    },
    createdBy  : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "users"
    },
    lastEditedOn : {
        type : String,
    },
    tags : [
        {type : String}
    ],
    attachments : [
        {type : String}
    ]
}, {timestamps: true});

const NotesModel = new mongoose.model("notes", NotesSchema);
export default NotesModel;