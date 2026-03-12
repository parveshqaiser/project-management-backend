
import ProjectModel from "../models/project.model.js";
import { UserModel } from "../models/user.model.js";


const createProject = async(req, res)=>{

    try {
        let user = req.user;

        // check role of the one who logs in, if he is admin, then create
        let {title, description, createdBy, startDate} = req.body;

        let project = await ProjectModel.create({
            title,
            description,
            createdBy : user.userId,
            startDate,
            members :[
                {
                    user:user.userId, 
                    role : "admin",
                    email : user.email
                }
            ]
        });

        res.status(201).json({message : "Project Created Successfully", suceess : true});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
};

const addProjectMembers = async(req, res)=>{
    try {
        let projectId = req.params.projectId;

        let {email,role} = req.body;

        // check role of the one who logs in, if he is admin, then add

        let projectExist = await ProjectModel.findById({_id:projectId});
         

        let userExist = await UserModel.findOne({email}).select("-password");

        if(!projectExist){
            return res.status(404).json({message : "Project Doesnot Exsit", success :false});
        }

        if(!userExist){
            return res.status(404).json({message : "Invalid User", success :false});
        }

        let addMembers = {
            user: userExist._id,
            email : email,
            role : role,
        };

        projectExist.members.push(addMembers);

        await projectExist.save();

        res.status(201).json({message : "Member Added Successfully", success:true});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
};


const getAllProjects = async(req, res)=>{

    try {
        let user = req.user; 
        let projects = await ProjectModel.find({createdBy: user.userId});
       
        res.status(200).json({
            data : projects || [], 
            message : `${projects.length}` ? "All Projects Fetched Successfully" : "No Project Found", 
            success: true
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
};

const getProject = async(req, res)=>{
    try {
        let {projectId} = req.params;

        let project = await ProjectModel.findById(projectId);

        console.log("***** " , project);
       
        if(!project){
            return res.status(404).json({message : "No Project Found", success : false});
        }

        res.status(200).json({message : "Project Details Fetched", data: project, success: true})

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
};

const updateProject = async(req, res)=>{

    try {
        let {projectId} = req.params;

        let {title, description,startDate} = req.body;

        let project = await ProjectModel.findByIdAndUpdate(
            projectId, 
            {title, description,startDate},
            {new: true}
        );
       
        if(!project){
            return res.status(404).json({message : "No Project Found", success : false});
        }

        res.status(200).json({message : "Project Updated" , success: true , data : project});
         
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}

const deleteProject = async(req, res)=>{
    try {
        let {projectId} = req.params;

        let project = await ProjectModel.findByIdAndDelete(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({message : "Project Deleted" , success: true });
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}


export {
    createProject, 
    addProjectMembers, 
    getAllProjects, 
    getProject, 
    updateProject, 
    deleteProject
};