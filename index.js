import e from "express";
import bodyParser from "body-parser";
import cors from "cors";

import dotenv from "dotenv";
import mongoose from "mongoose";
// import testing from "./Routes/webhook.js";
// import Test from "./Models/testingModel.js";
import cookieParser from "cookie-parser";


// routes
import authRoute from "./Routes/authRoute.js";
import productRoute from "./Routes/productRoute.js";
import userRoute from "./Routes/userRoute.js";

const app = e();

// app.use(
//   bodyParser.json({
//     verify: (req, res, buf) => {
//       req.rawBody = buf.toString();
//     },
//   })
// );

dotenv.config();

// allow preflight requests

const allowedOrigins = [
  "https://lookupsclient.vercel.app/",
  "http://localhost:5173",
  "https://auth-fawn-eight.vercel.app/",
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
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if you need cookies
  })
);
app.options(/(.*)/, cors());

app.use(e.json());
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

mongoose
  .connect(process.env.MONGO_KEYS)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));


// app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
// app.use("/api/seller", userRoute);

// app.use("/", e.json(), testing);

// app.use("/api", testing);

// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal server error";

//   res.status(statusCode).json({
//     success: false,
//     message,
//     statusCode,
//   });
// });

// // module.exports = app;

// // import testing from "./Routes/webhook.js";

// // const app = e();

// // app.get("/", (req, res) => {
// //   res.send("Hello from Vercel backend!");
// // });

// // app.use("/api", testing);

// // const port = process.env.PORT || 3000;
// // app.listen(port, () => console.log(`Server running on port ${port}`));
