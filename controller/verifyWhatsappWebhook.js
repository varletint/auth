export const verifyWebhookFromWhatsapp = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const myToken = "verify";

  // if (mode === "subscribe" && token === myToken) {
  console.log("Webhook verified!");
  return res.status(200).send(challenge);
  // } else {
  //   return res.sendStatus(403);
  // }
};
