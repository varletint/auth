import dotenv from "dotenv";
dotenv.config();

import e from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";


// routes
import authRoute from "./Routes/authRoute.js";
import productRoute from "./Routes/productRoute.js";
import userRoute from "./Routes/userRoute.js";
import forgotPasswordRoute from "./Routes/forgotPasswordRoute.js";
import wishlistRoute from "./Routes/wishlistRoute.js";
import sellerApplicationRoute from "./Routes/sellerApplicationRoute.js";
import adminRoute from "./Routes/adminRoute.js";
import cartRoute from "./Routes/cartRoute.js";
import orderRoute from "./Routes/orderRoute.js";

// Business Management Routes
import inventoryRoute from "./Routes/inventoryRoute.js";
import customerRoute from "./Routes/customerRoute.js";
import saleRoute from "./Routes/saleRoute.js";
import expenseRoute from "./Routes/expenseRoute.js";

const app = e();



// allow preflight requests

const allowedOrigins = [
  "https://lookupss.vercel.app",
  "http://localhost:5173",
  "http://10.15.213.108:5173"
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // if you need cookies
  })
);
app.options(/(.*)/, cors());

app.use(e.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_KEYS);
    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

connectDB().then(() => {
  startServer();
});


app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/seller", userRoute);
app.use("/api/password", forgotPasswordRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/seller-application", sellerApplicationRoute);
app.use("/api/admin", adminRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);

// Business Management API Routes
app.use("/api/inventory", inventoryRoute);
app.use("/api/customers", customerRoute);
app.use("/api/sales", saleRoute);
app.use("/api/expenses", expenseRoute);



// Enhanced Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Generate request ID for tracking
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Log error details (always log on server, but sanitize for production)
  console.error(`[${new Date().toISOString()}] [${requestId}] Error ${statusCode}:`, {
    message: err.message,
    path: req.path,
    method: req.method,
    ip: req.ip,
    ...(isProduction ? {} : { stack: err.stack })
  });

  // Determine user-facing message (hide internal errors in production)
  let message = err.message || 'Internal server error';
  if (isProduction && statusCode >= 500) {
    message = 'Something went wrong. Please try again later.';
  }

  // Build response
  const response = {
    success: false,
    message,
    statusCode,
    requestId, // Helps users reference specific errors in support
    timestamp: new Date().toISOString(),
  };

  // Include stack trace in development only
  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }

  // Include validation errors if present (e.g., from express-validator)
  if (err.errors) {
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
});


