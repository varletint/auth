import Product from "../Models/testingModel.js";

export const creatPost = async (req, res, next) => {
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const textBody = message?.text?.body;

    // Only run if a message text exists
    if (textBody) {
      console.log("💬 Incoming message:", textBody);

      // const name = `testing ${Math.floor(Math.random() * 100)}`;
      const newTest = new Product({
        name: textBody,
        price: parseFloat(5000),
        category: "uncategorized",
      });

      await newTest.save();
      console.log(`💾 Saved: ${textBody}`);

      res.status(200).json({ success: true, textBody });
    } else {
      res.sendStatus(200); // no text message, still must respond
    }
  } catch (error) {
    console.error("❌ Error:", error);
    res.sendStatus(500);
  }
};

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
