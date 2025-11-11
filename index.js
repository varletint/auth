import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_KEYS)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
app.get("/testing", (req, res) => {
  res.send("Testing endpoint is working!");
});

app.post("/webhook", (req, res) => {
  const { name } = req.body;
  console.log("Received name:", name);
  res.json({ message: "Webhook received", name });
});
