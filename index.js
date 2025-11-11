import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

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

app.use(
  cors({
    origin: [
      "https://lookupsclient.vercel.app",
      // "http://localhost:5173",
      // "https://auth-fawn-eight.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.get("/testing", (req, res) => {
  res.send("Testing endpoint is working!");
});

app.post("/webhook", (req, res) => {
  const { name } = req.body;
  console.log("Received name:", name);
  alert("Webhook received with name: " + name);
  res.json({ message: "Webhook received", name });
});
