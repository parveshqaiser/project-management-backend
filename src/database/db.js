
import mongoose from "mongoose";

const dbConnection = async () => {
    const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("MongoDB connected:", conn.connection.host);
};

export default dbConnection;