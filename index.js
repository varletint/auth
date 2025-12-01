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

app.use(express.json());
app.use(cookieParser()); // Add cookie-parser middleware

// allow preflight requests

const allowedOrigins = [
  "https://lookupsclient.vercel.app",
  "http://localhost:5173",
  "https://auth-fawn-eight.vercel.app",
  "https://lookupsbackend-jjph96eps-deploy-react-apps-projects.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true, // Allow cookies and authentication headers
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
  })
);

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

// app.use("/api/auth", forgotPasswordRoute);
// app.use("/api/auth", authRouter);

// app.post("/webhook", async (req, res) => {
//   const entry = req.body.entry?.[0];
//   const changes = entry?.changes?.[0];
//   const message = changes?.value?.messages?.[0];

//   if (!message) {
//     return res.status(400).json({ error: "No message found in webhook" });
//   }

//   const user = message.from;
//   const text = message.text?.body?.toLowerCase();
//   if (text.trim() !== "hi") {
//     return res.sendStatus(400);
//   }
//   try {
//     const sendMe = async () => {
//       const resp = await fetch(
//         `https://graph.facebook.com/v22.0/886326117894676/messages`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${process.env.WAB_API_TOKEN}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             //   messaging_product: "whatsapp",
//             //   to: "2347063255405",
//             //   type: "text",
//             //   text: {
//             //     body: "Hello! This is a custom message instead of a template.d",
//             //   },

//             messaging_product: "whatsapp",
//             to: "2347063255405",
//             type: "interactive",
//             interactive: {
//               type: "button",
//               body: {
//                 text: "Available Plans",
//               },
//               action: {
//                 buttons: [
//                   {
//                     type: "reply",
//                     reply: {
//                       id: "500mb_299",
//                       title: ` 500MB ${new Intl.NumberFormat("en-NG", {
//                         style: "currency",
//                         currency: "NGN",
//                         minimumFractionDigits: 0,
//                         maximumFractionDigits: 0,
//                       }).format(299)}`,
//                     },
//                   },
//                   {
//                     type: "reply",
//                     reply: {
//                       id: "1gb_379",
//                       title: ` 1GB ${new Intl.NumberFormat("en-NG", {
//                         style: "currency",
//                         currency: "NGN",
//                         minimumFractionDigits: 0,
//                         maximumFractionDigits: 0,
//                       }).format(379)}`,
//                     },
//                   },
//                 ],
//               },
//             },
//           }),
//         }
//       );
//     };
//     sendMe();
//     res.sendStatus(200);
//   } catch (error) {
//     return error;
//   }
// });

// app.post("/webhook", async (req, res) => {
//   const entry = req.body.entry?.[0];
//   const changes = entry?.changes?.[0];
//   const message = changes?.value?.messages?.[0];

//   if (!message) {
//     return res.status(400).json({ error: "No message found in webhook" });
//   }

//   const user = message.from;
//   const text = message.text?.body?.toLowerCase();
//   if (text.trim() === "hi") {
//     try {
//       const sendMessage = async () => {
//         const resp = await fetch(
//           `https://graph.facebook.com/v22.0/886326117894676/messages`,
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer EAALamZBywGWUBPzHoziI9yZAJdkpyfLZBvnNtFJA6fipWDpq9tCpK2iAEnC4BGyZAZAiCckSnakPiWyK6Gi0ZBzrRe2m6GYZCvUsgVFXS7ZAEyzjUAMyqFQ64Qz5xcXHAPZCIZAFHnJHDcAmfJtddD0U0ZB1XNNGZBBM97lzpCx6Ux0DawlGn2ZA9bXelUEawyNXdjgxHYoekav7P2L81SkSFZBZA3Dx8P73wcmqMGwNGdc2SFx8MP9cAZDZD`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               //   messaging_product: "whatsapp",
//               //   to: "2347063255405",
//               //   type: "text",
//               //   text: {
//               //     body: "Hello! This is a custom message instead of a template.d",
//               //   },

//               messaging_product: "whatsapp",
//               to: "2347063255405",
//               type: "interactive",
//               interactive: {
//                 type: "button",
//                 body: {
//                   text: "Available Plans",
//                 },
//                 action: {
//                   buttons: [
//                     {
//                       type: "reply",
//                       reply: {
//                         id: "500mb_299",
//                         title: ` 500MB ${new Intl.NumberFormat("en-NG", {
//                           style: "currency",
//                           currency: "NGN",
//                           minimumFractionDigits: 0,
//                           maximumFractionDigits: 0,
//                         }).format(299)}`,
//                       },
//                     },
//                     {
//                       type: "reply",
//                       reply: {
//                         id: "1gb_379",
//                         title: ` 1GB ${new Intl.NumberFormat("en-NG", {
//                           style: "currency",
//                           currency: "NGN",
//                           minimumFractionDigits: 0,
//                           maximumFractionDigits: 0,
//                         }).format(379)}`,
//                       },
//                     },
//                   ],
//                 },
//               },
//             }),
//           }
//         );

//         console.log(resp.body);
//       };
//       sendMessage();
//       return res.sendStatus(200);
//     } catch (error) {
//       alert(error);
//     }
//   }
//   res.statusCode(403);
// });
