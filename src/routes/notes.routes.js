
import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { createNotes, getProjectNotes, updateNotes } from "../controllers/notes.controller.js";

const router = express.Router();

router.post("/:projectId", authenticateToken,createNotes);
router.put("/:projectId/note/:noteId", authenticateToken,updateNotes);
router.delete("/:projectId/note/:noteId", authenticateToken,updateNotes);
router.get("/:projectId", authenticateToken,getProjectNotes);

export default router;