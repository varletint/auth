import Product from "../Models/testingModel.js";
import UserState from "../Models/userSateModel.js";
import dotenv from "dotenv";

dotenv.config();

import {
  askForPhoneNumber,
  availableDataPlans,
  purchaseSuccessful,
} from "../Utilis/customsMessages.js";

async function updateState(user, state, extra = {}) {
  await UserState.findOneAndUpdate(
    { user },
    { user, state, ...extra },
    { upsert: true }
  );
}

export const dataPurchaseProcess = async (req, res, next) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return res.status(400).json({ error: "No message found in webhook" });
    }

    const user = message.from;
    const text = message.text?.body;

    if (text.toLowerCase().trim() === "buy data".trim()) {
      return await fetch(
        `https://graph.facebook.com/v22.0/886326117894676/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer EAALamZBywGWUBPxt5cnGOZBGRJkLvLUcO4ZC2BpAMZCJngqIphCD01i9u14ONSlKwDhsbZAWguqGE2vJr6mUOQCR8bkzP19ZAZCJJ4ayX4YNDmD23b1n68eAwYRsllyqWibcqKBRQcZBJwl0mc3avncVnXOPhs7zSNrICbpYLpswAzvsFJ5g6Xm23rs5LjYwMRhv9BRFiWqH8o4YpRoMDMtBkJjm9WzsPhFwWUWZA9EIglmmBCYUZD`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: `2347063255405`,
            type: "interactive",
            interactive: {
              type: "button",
              body: { text: "Available Plans" },
              action: {
                buttons: [
                  {
                    type: "reply",
                    reply: {
                      id: "500mb_299",
                      title: `500MB ${new Intl.NumberFormat("en-NG", {
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
                      title: `1GB ${new Intl.NumberFormat("en-NG", {
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
      // return res.sendStatus(200);
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
};

// export const createPost = async (req, res, next) => {
//   try {
//     // Extract WhatsApp message from webhook
//     const entry = req.body.entry?.[0];
//     const changes = entry?.changes?.[0];
//     const message = changes?.value?.messages?.[0];

//     if (!message) {
//       return res.status(400).json({ error: "No message found in webhook" });
//     }

//     const user = message.from;
//     const text = message.text?.body;
//     const timestamp = message.timestamp;

//     // await UserState.create({
//     //   user: user,
//     //   state: " ",
//     // });

//     if (text.toLowerCase().trim() === "buy data".trim()) {
//       // await updateState(user, "waiting_for_item");
//       // await UserState.create({
//       //   user,
//       //   state: "waiting_for_item",
//       // });
//       await availableDataPlans(user);
//       return res.sendStatus(200);
//     }
//     // let state = (await UserState.findOne({ user }))?.state || null;

//     // if (state === "waiting_for_item") {
//     //   await updateState(user, "WAITING_FOR_NUMBER", { selectedItem: text });
//     //   await askForPhoneNumber(user);
//     // }

//     // if (state === "WAITING_FOR_NUMBER") {
//     //   await updateState(user, "DONE", { phone: user });
//     //   const savedMessage = await Product.create({
//     //     product: `${user} ${text}`,
//     //   });
//     //   await purchaseSuccessful(user);
//     //   return res.sendStatus(200);
//     // }

//     // return res.status(200).json({
//     //   success: true,
//     //   message: "Message saved",
//     //   data: savedMessage,
//     // });
//     return res.sendStatus(200);
//   } catch (err) {
//     next(err);
//   }
// };

// export const createPost = async (req, res, next) => {
//   const bodyParams = req.body;
//   const toJson = JSON.stringify(bodyParams, null, 2);

//   const newProd = new Product({
//     name: toJson,
//     category: JSON.stringify(bodyParams),
//     price: parseFloat(2000),
//   });

//   try {
//     const savedProd = newProd.save();
//     res.status(200).json(`name: ${savedProd}`);
//   } catch (error) {
//     return res.status(403);
// }

// const message = req.body.entry?.changes?.value?.messages;
// const textBody = message?.text?.body;

// // Only run if a message text exists

// console.log("💬 Incoming message:", textBody);

// // const name = `testing ${Math.floor(Math.random() * 100)}`;
// const newTest = new Product({
//   name: textBody,
//   price: parseFloat(5000),
//   category: "uncategorized",
// });

// try {
//   const savedProd = await newTest.save();
//   console.log(`Saved: ${savedProd}`);

//   res.status(200).json({ success: true, savedProd });
// } catch (error) {
//   console.error(" Error:", error);
//   res.sendStatus(500);
// }
// };

// export const createPost = async (req, res, next) => {
//   const data = req.body;
//   const entries = data.entry || [];

//   for (const entry of entries) {
//     const changes = entry.change || [];

//     for (const change of changes) {
//       const value = change.value || {};
//       const messages = value.messages || [];

//       for (const msg of messages) {
//         const caption = msg.text?.body || "";

//         if (!caption?.trim()) {
//           return "can't post empty message";
//         }
//         const parts = caption.split(",").map((p) => p.trim());
//         const [category = "Uncategorized", name = "Unnamed", priceStr = "0"] =
//           parts;

//         const price = parseFloat(priceStr) || 0;
//         const newProduct = new Product({
//           category: category || "Uncategorized",
//           name: name || "Unnamed",
//           price,
//         });

//         try {
//           const savedProduct = await Product.save();
//           return res
//             .status(200)
//             .json({ success: false, message: savedProduct });
//         } catch (error) {
//           return res.status(401).json({ success: false, message: error });
//         }
//       }
//     }
//   }
// };
