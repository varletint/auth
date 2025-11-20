import express from "express";
import { sendText } from "../services/whatsapp.js";
// import { responseMessage } from "../controller/webhookController.js";

const router = express.Router();

router.post("/webhook", async () => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return res.status(400).json({ error: "No message found in webhook" });
    }

    const from = message.from;
    const text = message.text?.body;

    if (text.toLowerCase().trim() === "hi".trim()) {
      await sendText(from, "working");
      return res.sendStatus(200);
    }
    res.sendStatus(200);
  } catch (err) {
    const entry = req.body.entry?.[0];
    const msg = entry?.changes?.[0]?.value?.messages?.[0];
    const from = msg.from;

    await sendText(from, `error: ${err}`);
    console.error("WebhookController error", err);
    res.sendStatus(500);
  }
});

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
