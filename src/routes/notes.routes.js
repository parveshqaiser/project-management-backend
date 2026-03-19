
import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { createNotes } from "../controllers/notes.controller.js";

const router = express.Router();

router.post("/:projectId", authenticateToken,createNotes);

export default router;