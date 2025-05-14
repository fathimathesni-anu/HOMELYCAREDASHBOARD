import mongoose, { Schema } from "mongoose";

const useroleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    mobile: {
      type: String,
      required: true,
    },
    profilepic: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },

    // Fields only relevant for doctors or staff
    department: {
      type: String,
    },
    experience: {
      type: String,
    },

    // Role-Based Access
    role: {
      type: String,
      enum: ["admin", "doctor", "staff"],
      default: "doctor",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Userole = mongoose.model("Userole", useroleSchema);
