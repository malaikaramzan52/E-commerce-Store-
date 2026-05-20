import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_id: {
      type: String, // String avoids strict validation failures if order is missing or deleted, can also be ObjectId if strictly typed
    },
    complaint_type: {
      type: String,
      enum: ["Product Issue", "Delivery Delay", "Payment Issue", "Wrong Item", "Other"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true, // creates createdAt and updatedAt
  }
);

// Virtual field for complaint_id mapping to _id
complaintSchema.virtual("complaint_id").get(function () {
  return this._id.toHexString();
});

// Ensure virtuals are included when converted to JSON
complaintSchema.set("toJSON", {
  virtuals: true,
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
