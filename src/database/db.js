
import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log("MongoDB connected:", conn.connection.host);
    } catch (err) {
        console.error("MongoDB connection error:", err);
        // rethrow so callers can handle the failure
        throw err;
    }
};

export default dbConnection;