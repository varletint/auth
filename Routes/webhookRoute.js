import express from "express";
import UserState from "../Models/UserState.js";
import { STATES } from "../services/fsm.js";
import { dispatch } from "../services/dispatcher.js";
import { sendText } from "../services/whatsapp.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    const message = value?.messages?.[0];
    const from = message?.from;

    if (!message) return res.sendStatus(200);

    // Find or create user
    let user = await UserState.findOne({ phone: from });

    if (!user) {
      user = await UserState.create({
        phone: from,
        state: STATES.MAIN_MENU,
        tempData: {},
      });
    }

    // Session timeout check (5 minutes)
    const now = Date.now();
    if (user.lastUpdated && now - new Date(user.lastUpdated).getTime() > 300 * 1000) {
      user.state = STATES.MAIN_MENU;
      user.tempData = {};
      await sendText(from, "Session expired. Starting over.");
    }

    // Update last updated time
    user.lastUpdated = new Date();
    await user.save();

    // Dispatch to appropriate handler
    await dispatch(user, message);

    return res.sendStatus(200);
  } catch (err) {
    console.error("ERROR in webhook:", err);
    const from = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;

    return res.sendStatus(500);
  }
});

export default router;

