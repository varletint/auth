import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import Test from "./Models/testingModel.js";
import testRoute from "./Routes/webhookRoute.js";

dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_KEYS)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use(cors());
app.get("/testing", (req, res) => {
  res.send("Testing endpoint is working!");
});

app.get("/webhook", async (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const myToken = "verify";
  if (mode === "subscribe" && token === myToken) {
    console.log("Webhook verified!");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }

  res.status(200).json({ message: "Webhook verified successfully" });
});
// post whatsapp data

app.post("/webhook", testRoute);

// app.post("/webhook", async (req, res) => {
//   const name = `testin ${Math.floor(Math.random() * 100)}`;
//   const newTest = new Test({ name: name });
//   try {
//     await newTest.save();
//     res.status(200).json({ message: "Data created successfully", name });
//   } catch (error) {
//     console.log(error);
//   }
// });
// app.post("/webhook", async (req, res) => {
//   const { name } = req.body;
//   try {
//     const newTest = new Test({ name });
//     await newTest.save();
//     res.status(201).json({ success: true, message: "Data saved successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error saving data" });
//   }
// });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
