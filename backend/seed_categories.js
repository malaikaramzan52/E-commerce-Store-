import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";

dotenv.config();

const categories = [
  { categoryName: "Lawn", description: "Lawn collection", image: "https://via.placeholder.com/150", status: "active" },
  { categoryName: "Chiffon", description: "Chiffon collection", image: "https://via.placeholder.com/150", status: "active" },
  { categoryName: "Cotton", description: "Cotton collection", image: "https://via.placeholder.com/150", status: "active" },
  { categoryName: "Khaddar", description: "Khaddar collection", image: "https://via.placeholder.com/150", status: "active" }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");

    for (const cat of categories) {
      const existing = await Category.findOne({ categoryName: cat.categoryName });
      if (!existing) {
        await Category.create(cat);
        console.log(`Created category: ${cat.categoryName}`);
      } else {
        console.log(`Category ${cat.categoryName} already exists`);
      }
    }
    
    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
};

seedCategories();
