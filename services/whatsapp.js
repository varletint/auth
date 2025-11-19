import axios from "axios";
const token = process.env.WAB_API_TOKEN;
// const phoneId = process.env.PHONE_NUMBER_ID;
const base = `https://graph.facebook.com/v24.0/886326117894676/messages`;

// if (!token) {
//   console.warn("WA_TOKEN or PHONE_NUMBER_ID not set in env");
// }

export const sendMessage = async (to, payload) => {
  return axios.post(base, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const sendText = (to, text) =>
  sendMessage(to, {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  });

export const sendButtons = (to, bodyText, buttons) =>
  sendMessage(to, {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: { buttons },
    },
  });

export const sendList = (to, headerText, bodyText, sections) =>
  sendMessage(to, {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: headerText },
      body: { text: bodyText },
      action: { button: "Choose", sections },
    },
  });
