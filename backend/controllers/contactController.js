import Contact from "../models/Contact.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// SUBMIT QUERY (Public but captures user if logged in)
export const postQuery = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (e) {
            // Token invalid or expired, proceed as guest
        }
    }

    const query = await Contact.create({ 
        user: userId,
        name, 
        email, 
        phone, 
        subject, 
        message 
    });

    // Send Email to Admin via Nodemailer
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment");
      }

      // Using explicit host and port for better reliability
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use SSL/TLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: `"Elegance Couture Concierge" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Inquiry: ${subject || 'General Inquiry'} - from ${name}`,
        text: `You have received a new query from your Contact Us page.

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
User Type: ${userId ? 'Registered User' : 'Guest'}

Message:
${message}

--------------------------------------------------
This inquiry has also been logged in your Admin Dashboard.
`
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email notification failed to deliver:", emailError.message);
      // We don't return error here because the query was already saved in DB
    }

    res.status(201).json({ success: true, message: "Query received. Our team will contact you shortly.", query });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET MY QUERIES (User Dashboard)
export const getMyQueries = async (req, res) => {
    try {
        const queries = await Contact.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, queries });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// GET ALL QUERIES (Admin)
export const getAllQueries = async (req, res) => {
  try {
    const queries = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, queries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE STATUS (Admin)
export const updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const query = await Contact.findByIdAndUpdate(id, { status }, { returnDocument: "after" });
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });
    res.status(200).json({ success: true, query });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE QUERY (Admin)
export const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Query deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
