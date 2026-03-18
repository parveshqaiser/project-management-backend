import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "projects", 
        required: false 
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    taskCategory : {
        type : String,
        required : true,
        enum : ["Bug", "Feature", "Improvement","Other"]
    },
    status : {
        type : String,
        default: "Pending",
        enum: ["In Progress", "Review", "Pending", "Completed", "Close", "Deleted"],
    },
    priority : {
        type : String,
        default: "Medium",
        enum: ["Low","Medium","High"]
    },
    dueDate : {
        type: Date, 
        required: true
    },
    assignedTo : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    assignedBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
},{timestamps:true});

let TaskModel = new mongoose.model("tasks", TaskSchema);

export default TaskModel;