import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const mockProducts = [
    "Intricate Formal Lawn",
    "Midnight Aura Chiffon",
    "Emerald Silk Drapery"
];

const clearMockData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const result = await Product.deleteMany({ productName: { $in: mockProducts } });
        console.log(`Deleted ${result.deletedCount} mock products from database.`);

        process.exit();
    } catch (error) {
        console.error("Failed to clear mock data:", error.message);
        process.exit(1);
    }
}

clearMockData();
