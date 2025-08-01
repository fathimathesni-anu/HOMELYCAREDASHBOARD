import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profilepics", // Cloudinary folder
    allowed_formats: ["jpeg", "jpg", "png"],
    transformation: [{ width: 300, height: 300, crop: "limit" }],
  },
});

// Middleware
export const upload = multer({ storage });


