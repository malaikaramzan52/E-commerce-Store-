import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ["New", "Read", "Replied", "Resolved"], default: "New" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Contact", contactSchema);
