import e from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

const app = e();
app.use(cors());
app.use(e.json());
dotenv.config();
// app.listen(3000, () => console.log("server connected"));

app.get("/", async (req, res) => {
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

module.exports = app;
