import Order from "../models/Order.js";
import Cart from "../models/cart.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// PLACE ORDER
export const placeOrder = async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!products || products.length === 0 || !totalAmount || !shippingAddress) {
      return res.status(400).json({ success: false, message: "Missing order details" });
    }

    const order = await Order.create({
      userId: req.user._id,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    // Clear cart after placing order
    await Cart.findOneAndUpdate({ userId: req.user._id }, { products: [] });

    // Create Notification for Admin
    try {
      const orderRef = String(order._id).slice(-6).toUpperCase();
        await Notification.create({
            type: "order",
        message: `New order #${orderRef} placed for Rs. ${totalAmount.toLocaleString()}`,
            orderId: order._id,
            customerName: req.user.name || "Customer",
        });
    } catch (notifErr) {
        console.error("Notification creation failed:", notifErr);
    }

    res.status(201).json({ success: true, order, message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate({
        path: "products.productId",
        populate: { path: "categoryId", select: "categoryName" }
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE MY ORDER ADDRESS
export const updateMyOrderAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { shippingAddress } = req.body;

    const order = await Order.findOne({ _id: id, userId: req.user._id });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.orderStatus !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending orders can be updated" });
    }

    order.shippingAddress = shippingAddress;
    await order.save();

    res.status(200).json({ success: true, order, message: "Shipping address updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL ORDERS (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email").populate("products.productId").sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE ORDER STATUS (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(id, { orderStatus }, { returnDocument: "after" });
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order, message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// GET ADMIN NOTIFICATIONS
export const getAdminNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ isRead: false }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// MARK NOTIFICATION AS READ
export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { isRead: true });
        res.status(200).json({ success: true, message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
