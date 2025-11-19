import express from "express";
import { responseMessage } from "../controller/webhookController.js";

const router = express.Router();

router.post("/webhook", responseMessage);

export default router;

// import { dataPurchaseProcess } from "../controller/webhookController.js";

// const router = e.Router();
// // router.get("/webhook", verifyWebhookFromWhatsapp);
// // router.post(
// //   "/webhook",
// //   express.raw({ type: "application/json" }),
// //   createProduct
// // );

// // router.get("/webhook", dataPurchaseProcess);
// router.post("/webhook", dataPurchaseProcess);

// export default router;
