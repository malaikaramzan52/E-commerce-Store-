import express from "express";
import {
  signupUser,
  signupAdmin,
  loginUser,
  getAllUsers,
  updateUserProfile,
  getUserProfile,
  deleteUser,
  updateUserRole
} from "../controllers/authController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* Admin Route: List all users */
router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);
router.put("/users/:id/role", protect, admin, updateUserRole);

/* Signup Routes */
router.post("/signup", signupUser);
router.post("/admin/signup", signupAdmin);

/* Login Route */
router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;