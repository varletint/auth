import Product from "../Models/testingModel.js";
import UserState from "../Models/userSateModel.js";

async function updateState(user, state, extra = {}) {
  await UserState.findOneAndUpdate(
    { user },
    { user, state, ...extra },
    { upsert: true }
  );
}

export const createPost = async (req, res, next) => {
  try {
    // Extract WhatsApp message from webhook
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return res.status(400).json({ error: "No message found in webhook" });
    }

    const user = message.from;
    const text = message.text?.body;
    const timestamp = message.timestamp;
    let state = (await UserState.findOne({ user }))?.state || null;

    if (text.toLowercase() === "buy data") {
      // await updateState( user, "waiting_for_item" );
      await UserState.create({
        user,
        state: "waiting_for_item",
      });
      return res.sendStatus(200);
    }

    if (state === "waiting_for_item") {
      await updateState(user, "WAITING_FOR_NUMBER", { selectedItem: text });
      return res.sendStatus(200);
    }

    if (state === "WAITING_FOR_NUMBER") {
      await updateState(user, "DONE", { phone: text });
      const savedMessage = await Product.create({
        product: text,
      });
      return res.sendStatus(200);
    }

    // return res.status(200).json({
    //   success: true,
    //   message: "Message saved",
    //   data: savedMessage,
    // });
  } catch (err) {
    next(err);
  }
};

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
