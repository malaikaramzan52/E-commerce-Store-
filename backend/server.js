import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import authRoutes from "./routes/authRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import contactRoutes from "./routes/contactRoutes.js";
import complaintRoutes from "./routes/complaintRoute.js";

dotenv.config();

const app = express();

const configuredOrigin = process.env.FRONTEND_ORIGIN;
const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const extraConfiguredOrigins = configuredOrigin
  ? configuredOrigin.split(",").map((origin) => origin.trim()).filter(Boolean)
  : [];
const allowedOrigins = new Set([...defaultOrigins, ...extraConfiguredOrigins]);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isAllowedExact = allowedOrigins.has(origin);
    const isAllowedLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

    if (isAllowedExact || isAllowedLocalhost) {
      return callback(null, true);
    }

    return callback(new Error("CORS: Origin not allowed"));
  },
  credentials: true
};

/* Middleware */
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cors(corsOptions));

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/complaints", complaintRoutes);

/* MongoDB Connection */
connectDB();

/* Test Route */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* Start Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});