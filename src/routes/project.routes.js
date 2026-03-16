import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { 
    addProjectMembers, 
    createProject, 
    deleteProject, 
    getAllProjects, 
    getProject, 
    removeProjectMember, 
    updateProjectMemberRole, 
    updateProject 
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", authenticateToken, createProject);
router.post("/:projectId/members",authenticateToken,addProjectMembers);
router.get("/",authenticateToken, getAllProjects);
router.get("/:projectId",authenticateToken,getProject);
router.put("/:projectId", authenticateToken, updateProject);
router.delete("/:projectId", authenticateToken, deleteProject);
router.patch("/:projectId/members/:userId", authenticateToken, updateProjectMemberRole);
router.delete("/:projectId/members/:userId", authenticateToken, removeProjectMember);


export default router;