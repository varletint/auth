import e from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = e();

app.use(e.json());
dotenv.config();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "hell",
  });
});
// mongoose
//   .connect(process.env.MONGO_KEYS)
//   .then(() => console.log("db connected"))
//   .catch((err) => console.log(err));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// module.exports = app;

// const express = require("express");
// const app = express();

// app.get("/", (req, res) => {
//   res.send("Hello from Vercel backend!");
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server running on port ${port}`));
