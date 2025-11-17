export const responseMessage = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return res.status(400).json({ error: "No message found in webhook" });
    }

    const user = message.from;
    const text = message.text?.body?.toLowerCase();

    if (text.toLowerCase().trim() === "hi") {
      const waRes = await fetch(
        "https://graph.facebook.com/v22.0/886326117894676/messages",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer EAALamZBywGWUBPzHoziI9yZAJdkpyfLZBvnNtFJA6fipWDpq9tCpK2iAEnC4BGyZAZAiCckSnakPiWyK6Gi0ZBzrRe2m6GYZCvUsgVFXS7ZAEyzjUAMyqFQ64Qz5xcXHAPZCIZAFHnJHDcAmfJtddD0U0ZB1XNNGZBBM97lzpCx6Ux0DawlGn2ZA9bXelUEawyNXdjgxHYoekav7P2L81SkSFZBZA3Dx8P73wcmqMGwNGdc2SFx8MP9cAZDZD`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: "2347063255405",
            type: "text",
            text: {
              body: "Hello! How can I assist you today?",
            },
          }),
        }
      );

      const waData = await waRes.json();
      console.log("WA Response:", waData);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    return res.sendStatus(500);
  }
};
