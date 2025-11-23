import axios from "axios";
import dotenv from "dotenv";
import { MAIN_MENU_BUTTONS } from "../utils/templates.js";
import { PLAN_MAP } from "../utils/planMap.js";

dotenv.config();
const token = process.env.WAB_API_TOKEN;
// const phoneId = process.env.PHONE_NUMBER_ID;
const base = `https://graph.facebook.com/v22.0/886326117894676/messages`;

// if (!token)
//   console.warn("WA_TOKEN or PHONE_NUMBER_ID not set in env");
// }

export const sendMessage = async (payload) => {
  try {
    const response = await axios.post(base, payload, {
      headers: {
        Authorization: `Bearer ${process.env.WAB_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
    return null;
  }
};

export const sendText = (from, text) =>
  sendMessage({
    messaging_product: "whatsapp",
    to: `${from}`,
    type: "text",
    text: { body: text },
  });

// console.log(await sendText(2347063255405, "hello"));

export const sendButtons = (from, bodyText, buttons) =>
  sendMessage({
    messaging_product: "whatsapp",
    to: `${from}`,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: { buttons },
    },
  });

export const sendList = (from, headerText, bodyText, sections) =>
  sendMessage({
    messaging_product: "whatsapp",
    to: `${from}`,
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: headerText },
      body: { text: bodyText },
      action: {
        button: "Choose",
        sections,
      },
    },
  });
