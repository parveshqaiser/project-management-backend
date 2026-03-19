
import TaskModel from "../models/task.model.js";
import { UserModel } from "../models/user.model.js";
import ProjectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createTask = async(req, res)=>{
    try {
        let currentUser = req.user;
        let {projectId} = req.params;

        // check validation here

        let {title, description,taskCategory, status, priority, dueDate,assignedTo} = req.body;

        if(!assignedTo){
            return res.status(400).json({message : "Missing Assigned Field Required" , success: false});
        }

        if(!["admin","project_admin"].includes(currentUser.userRole)){
            return res.status(403).json({message : "You are not Authorized to Create Task", success: false});
        }

        let project = await ProjectModel.findOne({
            _id: projectId,
            members: {
                $elemMatch: {
                    email: assignedTo,
                    role: "member"
                }
            }
        });

        if(!project){
            return res.status(400).json({
                message: "Assigned user is not a valid project member",
                success: false
            });
        }

        let findMembers = project.members.find(mem => mem.email == assignedTo && mem.role == "member");

        let task = await TaskModel.create({
            projectId,
            title, 
            description,
            taskCategory, 
            status, 
            priority, 
            dueDate,
            assignedTo : {
                userId: findMembers.user,
                email : findMembers.email,
            },
            assignedBy: {
                userId : currentUser?.userId,
                username : currentUser?.user_name,
            }
        });

        // send mail to user here 

        res.status(201).json({message : "Task Created", success : true});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
};

export const getAllTask = async(req, res)=>{
    try {
        let currentUser = req.user;
        let {projectId} = req.params;

        let allTask = await TaskModel.find({projectId});

        res.status(200).json({
            data : allTask,
            message : `${allTask.length}` ? "Project Task Fetched" : "No Such Task Found", 
            success : true
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
};

export const getTaskDetails = async(req, res)=>{
    try {
        let {projectId,taskId} = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: "Invalid Project Id or Task Id",
                success: false,                
            });
        }

        let task = await TaskModel.findOne({_id:taskId , projectId:projectId});

        if(!task){
            return res.status(400).json({message : "Invalid Task", success : false});
        }

        res.status(200).json({data : task , message : "Task Details Fetched", success : true});


    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}

export const updateTask = async(req, res)=>{
    try {
        let {projectId,taskId} = req.params;

        let {title, description,taskCategory, status, priority, dueDate} = req.body; // not updating assigned member, change later

        // check validation

        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: "Invalid Project Id or Task Id",
                success: false,                
            });
        }

       const task = await TaskModel.findOneAndUpdate(
            { _id: taskId, projectId: projectId },
            {
                $set: {
                    title,
                    description,
                    taskCategory,
                    status,
                    priority,
                    dueDate
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found in this project",
                success: false
            });
        }

        // send updated task email to assigned member

        res.status(200).json({data : task, message : "Task Updated", success : true});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}

export const deleteTask = async (req, res)=>{
    try {
        let {projectId,taskId} = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: "Invalid Project Id or Task Id",
                success: false,                
            });
        }

        let task = await TaskModel.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found in this project",
                success: false
            });
        }

        res.status(200).json({message : "Task Deleted", success : true})

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}

export const updateAssignedTaskMember = async(req, res)=>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}
