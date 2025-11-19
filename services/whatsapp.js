import axios from "axios";
const token = process.env.WAB_API_TOKEN;
// const phoneId = process.env.PHONE_NUMBER_ID;
const base = `https://graph.facebook.com/v22.0/886326117894676/messages`;

// if (!token)
//   console.warn("WA_TOKEN or PHONE_NUMBER_ID not set in env");
// }

export const sendMessage = async (payload) => {
  // return await axios.post(base, payload, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  return await fetch(
    `https://graph.facebook.com/v22.0/886326117894676/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WAB_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
};

export const sendText = (from, text) =>
  sendMessage({
    messaging_product: "whatsapp",
    to: `${from}`,
    type: "text",
    text: { body: text },
  });

export const sendButtons = (to, bodyText, buttons) =>
  sendMessage({
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
  sendMessage({
    messaging_product: "whatsapp",
    to,
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
