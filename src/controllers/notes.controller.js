
import NotesModel from "../models/notes.model.js";

export const createNotes = async(req, res)=>{
    try {
        let currentUser = req.user;
        let {projectId} = req.params;
        
        if(currentUser.userRole !=="admin"){
            return res.status(403).json({message : "You are not Authorized to Create Notes", success: false});
        }

        // check validation here of req.body
        let {title,content} = req.body;

        let notes = await NotesModel.create({
            title,
            content,
            createdBy : currentUser.userId,
            projectId
        });    

        res.status(201).json({message: "Note Created", success : true});
      
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}