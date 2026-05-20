import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getAdminNotifications,
  markNotificationRead,
  updateMyOrderAddress
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/mine", protect, getUserOrders);
router.put("/mine/:id/address", protect, updateMyOrderAddress);
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);

// Notifications
router.get("/notifications/unread", protect, admin, getAdminNotifications);
router.put("/notifications/:id/read", protect, admin, markNotificationRead);

export default router;
