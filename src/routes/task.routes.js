

import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { 
    createTask, 
    deleteTask, 
    getAllTask, 
    getTaskDetails, 
    updateTask 
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/:projectId", authenticateToken,createTask);
router.get("/:projectId",authenticateToken, getAllTask);
router.get("/:projectId/task/:taskId", getTaskDetails);
router.put("/:projectId/task/:taskId", updateTask);
router.delete("/:projectId/task/:taskId", deleteTask);


export default router;