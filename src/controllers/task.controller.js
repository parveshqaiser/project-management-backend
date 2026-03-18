
import TaskModel from "../models/task.model.js";

export const createTask = async(req, res)=>{
    try {
        let currentUser = req.user;
        let {projectId} = req.params;

        let {title, description,taskCategory, status, priority, dueDate,assignedTo,assignedBy} = req.body;

        // let task = await TaskModel



    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
};