

import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { createTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/:projectId", authenticateToken,createTask);


export default router;