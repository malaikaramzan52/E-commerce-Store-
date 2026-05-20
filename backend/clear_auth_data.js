import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const clearAuthData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const result = await User.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} users/admins from the database.`);

        process.exit();
    } catch (error) {
        console.error("Failed to clear auth data:", error.message);
        process.exit(1);
    }
}

clearAuthData();
