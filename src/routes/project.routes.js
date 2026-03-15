import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { addProjectMembers, createProject, deleteProject, getAllProjects, getProject, removeProjectMember, updateProject } from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", authenticateToken, createProject);
router.post("/:projectId/members",addProjectMembers);
router.get("/",authenticateToken, getAllProjects);
router.get("/:projectId",authenticateToken,getProject);
router.put("/:projectId", authenticateToken, updateProject);
router.delete("/:projectId", authenticateToken, deleteProject);
// update members
// delete members
router.delete("/:projectId/members/:userId", authenticateToken, removeProjectMember)

export default router;