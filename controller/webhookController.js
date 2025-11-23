import UserState from "../Models/UserState.js";
import { STATES } from "../services/fsm.js";
import { dispatch } from "../services/dispatcher.js";
import { sendText } from "../services/whatsapp.js";

export const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const myToken = "verify";

  if (mode === "subscribe" && token === myToken) {
    console.log("Webhook verified!");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
};

export const handleIncomingWebhook = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    const message = value?.messages?.[0];
    const from = message?.from;

    if (!message) return res.sendStatus(200);


    let user = await UserState.findOne({ phone: from });

    if (!user) {
      user = await UserState.create({
        phone: from,
        state: STATES.MAIN_MENU,
        tempData: {},
      });
    }


    const now = Date.now();
    if (user.lastUpdated && now - new Date(user.lastUpdated).getTime() > 300 * 1000) {
      user.state = STATES.MAIN_MENU;
      user.tempData = {};
      await sendText(from, "Session expired.\n Type hi or hello to start over.");
    }


    user.lastUpdated = new Date();
    await user.save();


    await dispatch(user, message);

    return res.sendStatus(200);
  } catch (err) {
    console.error("ERROR in webhook:", err);
    const from = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
    if (from) {
      await sendText(from, `An error occurred:\n${err.message}\n\n${err.stack}`);
    }
    return res.sendStatus(500);
  }
};
