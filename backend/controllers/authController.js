import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

/* ===========================
   USER SIGNUP CONTROLLER
=========================== */
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    /* Check if user already exists */
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    /* Hash password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* Create new user */
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user" // Default role is always user
    });

    /* Send response with JWT token */
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during signup",
    });
  }
};

/* ===========================
   ADMIN SIGNUP CONTROLLER
=========================== */
export const signupAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    /* Check if user already exists */
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    /* Hash password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* Create admin user */
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      },
    });
  } catch (error) {
    console.error("Admin signup error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error during admin signup" });
  }
};

/* ===========================
   USER LOGIN CONTROLLER
=========================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* Check for static admin login */
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
       console.log("Static Admin Login Attempt Successful");
       // Look for admin in DB or create a dummy one if it doesn't exist to get an ID
       let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
       
       if (!admin) {
           const salt = await bcrypt.genSalt(10);
           const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
           admin = await User.create({
               name: "Administrator",
               email: process.env.ADMIN_EMAIL,
               password: hashedPassword,
               role: "admin"
           });
       } else if (admin.role !== "admin") {
           // Ensure existing user with this email becomes admin if using static credentials
           admin.role = "admin";
           await admin.save();
       }

       return res.status(200).json({
         success: true,
         message: "Admin Login successful",
         user: {
           id: admin._id,
           name: admin.name,
           email: admin.email,
           role: "admin", // Hardcode it here for safety
           token: generateToken(admin._id),
         },
       });
    }

    /* Check if user exists */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /* Compare password */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /* Login success with JWT token */
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   GET ALL USERS CONTROLLER (ADMIN)
=========================== */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   GET USER PROFILE CONTROLLER
=========================== */
export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   UPDATE USER PROFILE CONTROLLER
=========================== */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.address = req.body.address || user.address;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          address: updatedUser.address,
          role: updatedUser.role,
        },
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   DELETE USER CONTROLLER (ADMIN)
=========================== */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Self-deletion is restricted" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Identity eradicated from registry" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   UPDATE USER ROLE CONTROLLER (ADMIN)
=========================== */
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: `Protocol updated: Account modified to ${user.role} tier`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};