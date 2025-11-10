import e from "express";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import mongoose from "mongoose";
import testing from "./Routes/webhook.js";

const app = e();

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(e.json());
dotenv.config();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

mongoose
  .connect(process.env.MONGO_KEYS)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

app.use("/", testing);

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

// import testing from "./Routes/webhook.js";

// const app = e();

// app.get("/", (req, res) => {
//   res.send("Hello from Vercel backend!");
// });

// app.use("/api", testing);

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server running on port ${port}`));
