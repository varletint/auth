import e from "express";

import {
  checkwebhook,
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
router.post("/webhook", dataPurchaseProcess);

export default router;
