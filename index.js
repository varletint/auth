// import e from "express";
// // import bodyParser from "body-parser";

// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import testingRoute from "./Routes/whatsapp.webhook.route.js";
// import hellRoute from "./Routes/hello.route.js";

// const app = e();

// // app.use(
// //   bodyParser.json({
// //     verify: (req, res, buf) => {
// //       req.rawBody = buf.toString();
// //     },
// //   })
// // );

// app.use(e.json());
// dotenv.config();

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server running on port ${port}`));

// app.use("/api", hellRoute);
// app.get("/hell", (req, res) => {
//   res.status(200).json({
//     message: "hell",
//   });
// });

// // mongoose
// //   .connect(process.env.MONGO_KEYS)
// //   .then(() => console.log("db connected"))
// //   .catch((err) => console.log(err));

// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal server error";

//   res.status(statusCode).json({
//     success: false,
//     message,
//     statusCode,
//   });
// });

// module.exports = app;

import express from "express";
import testingRoute from "./Routes/whatsapp.webhook.route.js";

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
app.get("/", (req, res) => {
  res.send("wwwwww");
});
// app.use("/api", testingRoute);
