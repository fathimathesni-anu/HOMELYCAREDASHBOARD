import { User } from "../models/usermodel.js";
import bcrypt from "bcrypt";
import { genarateToken } from "../utils/token.js";

const NODE_ENV = process.env.NODE_ENV || "development"; // Make sure this is defined

export const uploadProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profilePicUrl = req.file.path; // Cloudinary URL

    const user = await User.findByIdAndUpdate(
      userId,
      { profilepic: profilePicUrl },
      { new: true }
    ).select("-password");

    res.json({ success: true, profilePic: profilePicUrl, user });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};


export const userSignup = async (req, res, next) => {
  try {
    console.log("Signup route hit");
    const { name, email, password, mobile, profilepic } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ❌ Typo fix: findone → findOne
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // ✅ Create user
    const userData = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      profilepic,
    });

    await userData.save();

    // ✅ Generate token
    const token = genarateToken(userData._id);

    // ✅ Set cookie
    // res.cookie("token", token);
    res.cookie("token", token, {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: true,
    });

    return res.status(201).json({ data: userData, message: "User account created" });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error"
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔐 Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 🍪 Generate and set token cookie
    const token = genarateToken(user._id);
    res.cookie("token", token, {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: true,
    });

    // ✅ Return user data with implicit role
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      profilepic: user.profilepic,
      role: "user", // 👈 Important for frontend redirect
    };

    return res.status(200).json({
      message: "Login successful",
      data: userData,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const userProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userData = await User.findById(userId).select("-password");
    return res.json({ data: userData, message: "user Profile fetched" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error"
    });
  }
};


export const userLogout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: true,
    });
    return res.json({ message: "user Logout success" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error"
    });
  }
};

/* export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, mobile } = req.body;

    // Construct update object
    const updateData = {
      name,
      email,
      mobile,
    };

    // If a new profile picture was uploaded
    if (req.file) {
      updateData.profilepic = `/uploads/profilePics/${req.file.filename}`;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
}; */

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, mobile } = req.body;

    const updateData = { name, email, mobile };

    if (req.file) {
      updateData.profilepic = req.file.path; // <-- Fix here
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Filter if needed
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching users', error });
  }
};