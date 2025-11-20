import express from "express";
import { sendButtons, sendList, sendText } from "../services/whatsapp.js";
import { MAIN_MENU_BUTTONS } from "../utils/templates.js";
// import { responseMessage } from "../controller/webhookController.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  try {
    await sendButtons(from, `Hello, your are Welcome`, MAIN_MENU_BUTTONS);
    return res.sendStatus(200);

    // res.sendStatus(200);
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
