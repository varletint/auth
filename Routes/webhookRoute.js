import express from "express";
import { sendButtons, sendList, sendText } from "../services/whatsapp.js";
import { MAIN_MENU_BUTTONS } from "../utils/templates.js";
// import { responseMessage } from "../controller/webhookController.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    const message = value?.messages?.[0]; // Could be undefined
    const from = message?.from;

    // ⛔ If it's not a user message (e.g. status update), stop here
    if (!message) {
      console.log("No user message — ignoring.");
      return res.sendStatus(200);
    }

    // TEXT MESSAGE
    const text = message?.text?.body;

    // INTERACTIVE MESSAGE (BUTTON / LIST)
    const button = message?.interactive?.button_reply;
    const list = message?.interactive?.list_reply;

    // ---------------- BUTTON REPLIES ----------------
    if (button) {
      const id = button.id;

      if (id === "buy_data") {
        await sendButtons(from, "Choose network:", [
          { type: "reply", reply: { id: "network_mtn", title: "MTN" } },
          { type: "reply", reply: { id: "network_airtel", title: "Airtel" } },
        ]);
        return res.sendStatus(200);
      }

      if (id === "buy_airtime") {
        await sendList(from, "Airtime Amounts", "Choose amount", [
          {
            title: "Amounts",
            rows: [
              { id: "amt_100", title: "₦100" },
              { id: "amt_500", title: "₦500" },
            ],
          },
        ]);
        return res.sendStatus(200);
      }

      if (id === "support") {
        await sendText(
          from,
          "Support coming soon — chat with our agent at +2349026645775"
        );
        return res.sendStatus(200);
      }
    }

    // ---------------- LIST REPLIES (OPTIONAL) ----------------
    if (list) {
      const id = list.id;
      await sendText(from, `You selected: ${id}`);
      return res.sendStatus(200);
    }

    // ---------------- DEFAULT MESSAGE ----------------
    await sendButtons(from, "Hello, you are Welcome", MAIN_MENU_BUTTONS);

    return res.sendStatus(200);
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
