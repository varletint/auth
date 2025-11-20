import express from "express";
import { sendButtons, sendText } from "../services/whatsapp.js";
import { MAIN_MENU_BUTTONS } from "../utils/templates.js";
// import { responseMessage } from "../controller/webhookController.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    // if (!message) {
    //   return res.status(400).json({ error: "No message found in webhook" });
    // }

    const from = message.from;
    const text = message.text?.body;

    const button = message?.interactive?.button_reply;
    if (button) {
      const id = button.id;

      // BUY DATA
      if (id === "buy_data") {
        await sendButtons(from, "Choose network:", [
          { type: "reply", reply: { id: "network_mtn", title: "MTN" } },
          { type: "reply", reply: { id: "network_airtel", title: "Airtel" } },
        ]);

        // user.state = STATES.SELECTING_NETWORK;
        // await touch();
        return res.sendStatus(200);
      }

      // BUY AIRTIME
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

        // user.state = STATES.SELECTING_PLAN;
        // await touch();
        return res.sendStatus(200);
      }

      // SUPPORT
      if (id === "support") {
        await sendText(
          from,
          "Support coming soon — chat with our agent at +2349026645775"
        );
        // await touch();
        return res.sendStatus(200);
      }
    }

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
