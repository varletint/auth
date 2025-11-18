// export const responseMessage = async (req, res) => {
//   try {
//     const entry = req.body.entry?.[0];
//     const changes = entry?.changes?.[0];
//     const message = changes?.value?.messages?.[0];

//     if (!message) {
//       return res.status(400).json({ error: "No message found in webhook" });
//     }

//     const user = message.from;
//     const text = message.text?.body?.toLowerCase();

//     if (text.trim() === "hi") {
//       const waRes = await fetch(
//         "https://graph.facebook.com/v22.0/886326117894676/messages",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer EAALamZBywGWUBPzHoziI9yZAJdkpyfLZBvnNtFJA6fipWDpq9tCpK2iAEnC4BGyZAZAiCckSnakPiWyK6Gi0ZBzrRe2m6GYZCvUsgVFXS7ZAEyzjUAMyqFQ64Qz5xcXHAPZCIZAFHnJHDcAmfJtddD0U0ZB1XNNGZBBM97lzpCx6Ux0DawlGn2ZA9bXelUEawyNXdjgxHYoekav7P2L81SkSFZBZA3Dx8P73wcmqMGwNGdc2SFx8MP9cAZDZD`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             messaging_product: "whatsapp",
//             to: "2347063255405",
//             type: "text",
//             text: {
//               body: "Hello! How can I assist you today?",
//             },
//           }),
//         }
//       );

//       const waData = await waRes.json();
//       console.log("WA Response:", waData);
//     }

//     return res.sendStatus(200);
//   } catch (error) {
//     console.error("Webhook error:", error);
//     return res.sendStatus(500);
//   }
// };

import dotenv from "dotenv";

dotenv.config();

const sendHello = async () => {
  const res = await fetch(
    `https://graph.facebook.com/v22.0/886326117894676/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WAB_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //   messaging_product: "whatsapp",
        //   to: "2347063255405",
        //   type: "text",
        //   text: {
        //     body: "Hello! This is a custom message instead of a template.d",
        //   },

        messaging_product: "whatsapp",
        to: "2347063255405",
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: "Available Plans",
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "500mb_299",
                  title: ` 500MB ${new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(299)}`,
                },
              },
              {
                type: "reply",
                reply: {
                  id: "1gb_379",
                  title: ` 1GB ${new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(379)}`,
                },
              },
            ],
          },
        },
      }),
    }
  );

  console.log(res.body);
};

sendHello();
