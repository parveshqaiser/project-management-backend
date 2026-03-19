// load environment variables before any other imports
import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnection from "./database/db.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 6500;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "",
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true,
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.get("/", (req, res) => {
	res.status(200).json({ message: "Welcome to Project Management Backend", success: true });
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/projects",projectRoutes);
app.use("/api/v1/tasks", taskRoutes);

dbConnection()
	.then(() => {
		app.listen(PORT, () => {
		console.log(`Server is running at port http://localhost:${PORT}`);
		});
	})
	.catch((error) => {
		console.log("Some error in connecting DB ", error);
		process.exit(1);
});
