import express from "express";

import {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  updateProduct,
  softDeleteProduct,
  permanentDeleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Product
router.post("/", protect, createProduct);

// Get All Products (with filters) - Public
router.get("/", getAllProducts);

// Get Products by Category - Public
router.get("/category/:categoryId", getProductsByCategory);

// Delete the route for getDiscountedProducts as it's now part of getAllProducts with ?discounted=true

// Get Single Product - Public
router.get("/:id", getProductById);

// Update Product
router.put("/:id", protect, updateProduct);

// Soft Delete (Trash)
router.delete("/:id", protect, softDeleteProduct);

// Permanent Delete
router.delete("/permanent/:id", protect, permanentDeleteProduct);

export default router;