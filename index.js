// Load environment variables FIRST, before any other imports
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

const app = e();

// app.use(
//   bodyParser.json({
//     verify: (req, res, buf) => {
//       req.rawBody = buf.toString();
//     },
//   })
// );

// allow preflight requests

const allowedOrigins = [
  "https://auth-fawn-eight.vercel.app",
  "http://localhost:5173",
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

// app.use("/", e.json(), testing);

// app.use("/api", testing);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// // module.exports = app;

// // import testing from "./Routes/webhook.js";

// // const app = e();

// // app.get("/", (req, res) => {
// //   res.send("Hello from Vercel backend!");
// // });

// // app.use("/api", testing);

// // const port = process.env.PORT || 3000;
// // app.listen(port, () => console.log(`Server running on port ${port}`));
