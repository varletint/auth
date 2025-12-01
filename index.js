import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import webhookRoute from "./Routes/webhookRoute.js";
import authRoute from "./Routes/authRoute.js";
import productRoute from "./Routes/productRoute.js";
import userRoute from "./Routes/userRoute.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true, // Allow any origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true, // Allow cookies and authentication headers
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
  })
);

// Handle preflight requests for all routes
app.options(/.*/, cors());

app.use(express.json());
app.use(cookieParser()); // Add cookie-parser middleware

// allow preflight requests

const allowedOrigins = [

  "https://auth-fawn-eight.vercel.app",
  "http://localhost:5173",
];

const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_KEYS);
    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Connect to DB then start the server
connectDB().then(() => {
  // Attempt to connect to Redis (non-blocking)
  // connectRedis();
  startServer();
});





// Routes
app.use("/", webhookRoute);
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/seller', userRoute);

// Global Error Handling Middleware (Must be AFTER all routes)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error to console for debugging
  console.error(`[ERROR ${statusCode}]:`, message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Send error response to frontend
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

