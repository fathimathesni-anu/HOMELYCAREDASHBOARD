import { Userole } from "../models/userolemodel.js";
import bcrypt from "bcrypt";
import { genarateToken } from "../utils/token.js";
const NODE_ENV = process.env.NODE_ENV || "development";


export const uploadProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;
    const profilePicUrl = `/uploads/profilePics/${req.file.filename}`;

    const user = await Userole.findByIdAndUpdate(
      userId,
      { profilePic: profilePicUrl },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

export const useroleSignup = async (req, res, next) => {
  try {
    console.log("Signup userole route hit");
    const { name, email, password, mobile, profilepic, role } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Validate role
    const allowedRoles = ["admin", "doctor", "staff"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // ✅ Check if user exists
    const isUseroleExist = await Userole.findOne({ email });
    if (isUseroleExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // ✅ Create user with all fields
    const newuserole = new Userole({
      name,
      email,
      password: hashedPassword,
      mobile,
      profilepic,
      role, // <-- Important!
    });

    await newuserole.save();

    // ✅ Generate token using actual role
    const token = genarateToken(newuserole._id, newuserole.role);

    // ✅ Set cookie
    res.cookie("token", token, {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: true,
    });

   /*  return res.json({ success: true, message: "User account created successfully" }); */
   return res.json({
    success: true,
    message: "User account created successfully",
    token,
    role: newuserole.role, // important for navigation
  });
  

  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error"
    });
  }
};


export const useroleLogin = async (req, res, next) => {
  try {
    console.log("login userole route hit");

    const { email, password: plainPassword, role } = req.body;

    if (!email || !plainPassword || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const UseroleExist = await Userole.findOne({ email });
    if (!UseroleExist) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (UseroleExist.role !== role) {
      return res.status(403).json({ message: "Incorrect role for this account" });
    }

    const passwordMatch = bcrypt.compareSync(plainPassword, UseroleExist.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = genarateToken(UseroleExist._id, UseroleExist.role);

    res.cookie("token", token, {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: true,
    });

    const userObject = UseroleExist.toObject();
    const { password, ...userDataWithoutPassword } = userObject;

    return res.json({ data: userDataWithoutPassword, message: "Login successful" });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error"
    });
  }
};

export const useroleProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userData = await Userole.findById(userId).select("-password");
    return res.json({ data: userData, message: "user Profile fetched" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error"
    });
  }
};

export const useroleLogout = async (req, res, next) => {
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