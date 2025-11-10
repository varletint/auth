import e from "express";
// import { createProduct } from "../controller/whatsapp.webhook.controller.js";
// import { verifyWebhookFromWhatsapp } from "../controller/verify.whatsapp.webhook.controller.js";
import { testingWebhook } from "../controller/webhookController.js";

const router = e.Router();
// router.get("/webhook", verifyWebhookFromWhatsapp);
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   createProduct
// );

router.get("/webhook", testingWebhook);

export default router;
