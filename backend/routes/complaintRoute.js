import express from "express";
import {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus,
} from "../controllers/complaintController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", protect, createComplaint);
router.get("/my", protect, getUserComplaints);

// Admin routes
router.get("/", protect, admin, getAllComplaints);
router.put("/:id/status", protect, admin, updateComplaintStatus);

export default router;
