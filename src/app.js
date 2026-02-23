import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnection from "./database/db.js";

const app = express();
const PORT = 6500;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin : "",
    methods : ["GET", "POST", "PUT", "PATCH","DELETE"],
    credentials : true,
    allowedHeaders : ["Content-Type", "Authorization"]
}))

dotenv.config({
    path : "./.env"
});



// testing purpose
app.get("/", (req, res)=>{
    res.status(200).json({message : "Welcome to Project Management Backend", success : true});
});

dbConnection().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running at port http://localhost:${PORT}`);
    });
}).catch(error =>{
    console.log("Some error in connectiing DB ",error)
})


