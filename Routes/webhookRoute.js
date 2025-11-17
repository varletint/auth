import e from "express";
// import { createProduct } from "../controller/whatsapp.webhook.controller.js";
import { verifyWebhookFromWhatsapp } from "../controller/verifyWhatsappWebhook.js";
import {
  createPost,
  dataPurchaseProcess,
} from "../controller/webhookController.js";

import { responseMessage } from "../controller/respose.js";

const router = e.Router();
// router.get("/webhook", verifyWebhookFromWhatsapp);
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   createProduct
// );

router.post("/webhook", async (req, res) => {
  console.log("goo");
});

export default router;
