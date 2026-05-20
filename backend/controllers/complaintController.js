import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";

// Create a new complaint
export const createComplaint = async (req, res) => {
  try {
    const { order_id, complaint_type, subject, description, image } = req.body;
    
    if (!complaint_type || !subject || !description) {
      return res.status(400).json({ success: false, message: "Type, Subject, and Description are required" });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      order_id,
      complaint_type,
      subject,
      description,
      image,
    });
    
    // Create Notification for Admin
    try {
        await Notification.create({
            type: "complaint",
            message: `New complaint filed: ${subject}`,
            complaintId: complaint._id,
            customerName: req.user.name || "Customer",
        });
    } catch (notifErr) {
        console.error("Notification creation failed:", notifErr);
    }
    
    res.status(201).json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all complaints for the logged-in user
export const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user._id;
    const complaints = await Complaint.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, complaints: complaints || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all complaints (Admin)
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update complaint status (Admin)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
