import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Test from "./Models/testingModel.js";

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

app.post("/webhook", async (req, res) => {
  const { name } = req.body;

  try {
    await Test.create({ name });
    Test.save();
  } catch (error) {
    console.error("Error saving to database:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  console.log("Received name:", name);
  res.json({ message: "Webhook received", name });
});
