import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

dotenv.config();

const categories = [
  {
    categoryName: "Lawn",
    description: "Premium Ladies Lawn Dresses",
    image: "https://images.unsplash.com/photo-1585487000160-00da50edfd08?q=80&w=2000&auto=format&fit=crop",
    status: "active",
  },
  {
    categoryName: "Cotton",
    description: "Elegant Stitched Cotton Suits",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop",
    status: "active",
  },
  {
    categoryName: "Chiffon",
    description: "Luxury Chiffon Evening Wear",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop",
    status: "active",
  },
];

const products = [
  {
    productName: "Intricate Formal Lawn",
    price: 12500,
    discountPrice: 11000,
    categoryName: "Lawn",
    fabricType: "Lawn",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Off-White", "Gold"],
    description: "Indulge in the finest ethnic craftsmanship. This piece from our Pret Wear collection is intricately designed with premium fabrics and traditional patterns.",
    images: [
        "https://images.unsplash.com/photo-1585487000160-00da50edfd08?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1020&auto=format&fit=crop"
    ],
    stockQuantity: 50,
    rating: 4.8,
  },
  {
    productName: "Midnight Aura Chiffon",
    price: 13500,
    discountPrice: 12000,
    categoryName: "Chiffon",
    fabricType: "Chiffon",
    sizes: ["M", "L"],
    colors: ["Midnight Blue", "Silver"],
    description: "Make a statement with our Midnight Aura Chiffon ensemble. Designed for elegant evening affairs, it features delicate detailed borders.",
    images: [
        "https://images.unsplash.com/photo-1510405232924-f7bca74e0d49?q=80&w=1934&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974&auto=format&fit=crop"
    ],
    stockQuantity: 30,
    rating: 4.9,
  },
  {
    productName: "Emerald Silk Drapery",
    price: 14500,
    discountPrice: 0,
    categoryName: "Cotton", // Mapping Silk suit to Cotton for now as per categories
    fabricType: "Silk",
    sizes: ["S", "M", "L"],
    colors: ["Emerald Green"],
    description: "A masterpiece in rich silk, the Emerald Silk Drapery features intricate hand-embroidery and a silhouette that flows with grace.",
    images: [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2070&auto=format&fit=crop"
    ],
    stockQuantity: 25,
    rating: 4.7,
  }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for Seeding...");

        // Clear existing
        try {
            await Category.collection.drop();
            await Product.collection.drop();
            console.log("Dropped existing collections to clear indexes.");
        } catch (e) {
            console.log("No existing collections to drop or could not drop.");
        }

        // Insert Categories
        const createdCategories = await Category.insertMany(categories);
        console.log("Inserted Categories.");

        // Map category IDs to products
        const productsWithIds = products.map(prod => {
            const cat = createdCategories.find(c => c.categoryName === prod.categoryName);
            const { categoryName, ...rest } = prod;
            return {
                ...rest,
                categoryId: cat ? cat._id : null
            };
        }).filter(p => p.categoryId !== null);

        // Insert Products
        await Product.insertMany(productsWithIds);
        console.log("Inserted Products.");

        console.log("Database Seeded Successfully!");
        process.exit();
    } catch (error) {
        console.error("Seeding Failed:", error.message);
        process.exit(1);
    }
}

seedDB();
