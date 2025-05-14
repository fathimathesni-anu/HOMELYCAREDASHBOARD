import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/index.js";

dotenv.config();

const app = express();

// Connect to the database
connectDB();

// CORS configuration
const corsOptions = {
  origin: [
     "https://homelycaredashboard.vercel.app"// your Vercel frontend domain
   , "http://localhost:5173", // your local development domain
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // Allow credentials (cookies, etc.)
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Apply CORS globally
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Static file serving (e.g., for file uploads)
app.use("/uploads", express.static("uploads"));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// API routes
app.use("/api", apiRouter);

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});












