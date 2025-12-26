import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary';

// Update User Profile Image: /api/user/update-image
export const updateImage = async (req, res) => {
  try {
    const userId = req.userId; // Provided by authUser middleware
    const imageFile = req.file; // Provided by multer middleware

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    
    const imageUrl = imageUpload.secure_url;

    // Update user record in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { image: imageUrl }, 
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ 
      success: true, 
      message: "Profile image updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Update image error:", error.message || error);
    res.status(500).json({ success: false, message: error.message || "Update failed" });
  }
};


//Register User Model : /api/user/register
export const register = async (req, res) => {
  try {
    // Validate JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured in .env");
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    const { name, email, password } = req.body;
    console.log("Register request body:", { name, email, password: password ? "***" : undefined });
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true, //Prevent JavaScript to Access cokkie
      secure: process.env.NODE_ENV === "production", //Use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, //Cookie expiration time
    });
    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Register error:", error.message || error);
    res.status(500).json({ success: false, message: error.message || "Registration failed" });
  }
};

//Login user :/api/user/login

export const login = async (req, res) => {
  try {
    // Validate JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured in .env");
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    const { email, password } = req.body;
    console.log("Login request body:", { email, password: password ? "***" : undefined });

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, //Cookie expiration time
    });
    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error.message || error);
    res.status(500).json({ success: false, message: error.message || "Login failed" });
  }
};

//Logout User : /api/user/logout  
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.json({ success: true, message: "Logged Out" });
    
  } catch (error) {
    console.error("Logout error:", error.message || error);
    res.status(500).json({ success: false, message: error.message || "Logout failed" });
  }
};

//  User Auth: /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    // authUser middleware attaches req.userId — fallback to body if present
    const userId = req.userId || req.body?.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.error(" Is-Auth error:", error.message || error);
    res.status(500).json({ success: false, message: error.message || "Authentication failed" });
  }
};


