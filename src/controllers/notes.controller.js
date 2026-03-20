
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

export const updateNotes = async(req, res)=>{

    try {
        let currentUser = req.user;
        let {projectId, noteId} = req.params;

        if(currentUser.userRole !=="admin"){
            return res.status(403).json({message : "You are not Authorized to Update Notes", success: false});
        }

        // check validation here of req.body
        let {title,content} = req.body;

        let note = await NotesModel.findOne({projectId, _id:noteId});

        if(!note){
            return res.status(404).json({message : "Notes Doesn't Exist", success :false});
        }

        note.title = title;
        note.content = content;

        await note.save();
        res.status(200).json({message: "Note Updated", success : true});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}

export const deleteNote = async(req, res)=>{
    try {

        let currentUser = req.user;
        let {projectId, noteId} = req.params;

        if(currentUser.userRole !=="admin"){
            return res.status(403).json({message : "You are not Authorized to Delete Notes", success: false});
        }

        let note = await NotesModel.findByIdAndDelete(noteId);

        if(!note){
            return res.status(404).json({message : "Notes Doesn't Exist", success :false});
        }

        res.status(200).json({message: "Note Deleted", success : true});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}

export const getProjectNotes = async(req, res)=>{
    try {
        let currentUser = req.user;
        let {projectId} = req.params;

        let notes = await NotesModel.find({projectId});

        if(!notes){
            return res.status(404).json({message : "No Notes Found", success: false});
        }

        res.status(200).json({data : notes , message : "Notes Fetched", success:true});

        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}