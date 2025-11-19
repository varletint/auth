import e from "express";
// import { createProduct } from "../controller/whatsapp.webhook.controller.js";
import { verifyWebhookFromWhatsapp } from "../controller/verifyWhatsappWebhook.js";
import {
  checkwebhook,
  createPost,
  dataPurchaseProcess,
} from "../controller/webhookController.js";

const router = e.Router();
// router.get("/webhook", verifyWebhookFromWhatsapp);
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   createProduct
// );

// router.get("/webhook", dataPurchaseProcess);
router.get("/webhook", checkwebhook);

export default router;
