import express from "express";
import { postQuery, getAllQueries, updateQueryStatus, deleteQuery, getMyQueries } from "../controllers/contactController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC/USER: Submit a query
router.post("/submit", postQuery);
router.get("/my", protect, getMyQueries);

// ADMIN: Manage queries
router.get("/all", protect, admin, getAllQueries);
router.put("/:id/status", protect, admin, updateQueryStatus);
router.delete("/:id", protect, admin, deleteQuery);

export default router;
