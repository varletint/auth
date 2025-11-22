import express from "express";
import UserState from "../Models/UserState.js";
import Purchase from "../Models/Purchase.js";
import AuditLog from "../Models/AuditLog.js";

import { sendButtons, sendList, sendText } from "../services/whatsapp.js";
import { STATES } from "../services/fsm.js";
import { MAIN_MENU_BUTTONS } from "../utils/templates.js";
import { plan_map } from "../utils/planMap.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  try {
    AuditLog.create({ type: "webhook", payload: req.body });

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    const message = value?.messages?.[0];
    const from = message?.from;

    if (!message) return res.sendStatus(200);

    const text =
      message?.text?.body ||
      message?.interactive?.button_reply?.id ||
      message?.interactive?.list_reply?.id;

    const button = message?.interactive?.button_reply || null;
    const list = message?.interactive?.list_reply || null;

    let user =
      (await UserState.findOne({ phone: from })) ||
      (await UserState.create({
        phone: from,
        state: STATES.MAIN_MENU,
        tempData: {},
      }));

    const touch = async () => {
      user.lastUpdated = new Date();
      await user.save();
    };

    const now = Date.now();
    if (now - new Date(user.lastUpdated).getTime() > 300 * 1000) {
      user.state = STATES.MAIN_MENU;
      user.tempData = {};
      user.markModified("tempData");
      await user.save();
      await sendText(from, "Session expired. Starting over.");
      return res.sendStatus(200);
    }

    if (text) {
      const t = text.toLowerCase().trim();
      if (t === "hi" || t === "hello") {
        user.state = STATES.MAIN_MENU;
        user.tempData = {};
        user.markModified("tempData");
        await user.save();

        await sendButtons(from, "What can I do for you?", MAIN_MENU_BUTTONS);
        return res.sendStatus(200);
      }
    }

    if (button) {
      const id = button.id;

      // Buy Data
      if (id === "buy_data") {
        await sendButtons(from, "Choose Network", [
          { type: "reply", reply: { id: "mtn", title: "MTN" } },
          { type: "reply", reply: { id: "airtel", title: "Airtel" } },
        ]);
        // await sendList(from, "Network", "Select Network", [
        //   {
        //     title: "Networks",
        //     rows: [
        //       { id: "mtn", title: "MTN" },
        //       { id: "airtel", title: "Airtel" },
        //     ],
        //   },
        // ]);

        user.state = STATES.SELECTING_NETWORK;
        await touch();
        return res.sendStatus(200);
      }

      if (id === "buy_airtime") {
        await sendList(from, "Airtime Amounts", "Select Amount", [
          {
            title: "Amounts",
            rows: [
              { id: "amt_100", title: "₦100" },
              { id: "amt_500", title: "₦500" },
            ],
          },
        ]);

        user.state = STATES.SELECTING_PLAN;
        await touch();
        return res.sendStatus(200);
      }

      if (id === "support") {
        await sendText(
          from,
          "Support coming soon — chat with our agent at +2349026645775"
        );
        return res.sendStatus(200);
      }
    }

    if (list) {
      const id = list.id;
      const title = list.title;
      user.tempData = user.tempData || {};
      // user.tempData.network = id.includes("mtn")
      //   ? "MTN".toLowerCase()
      //   : "Airtel".toLowerCase();
      // await user.save();

      if (user.state === STATES.SELECTING_NETWORK) {
        user.tempData = user.tempData || {};
        // user.tempData.network = id.includes("mtn")
        //   ? "MTN".toLowerCase()
        //   : "Airtel".toLowerCase();
        user.markModified("tempData");

        const rowss = Object.entries(plan_map[id.toUpperCase()]).map(
          ([key, v]) => ({
            id: key,
            title: v.desc,
          })
        );

        await sendList(
          from,
          `${user.tempData.network.toUpperCase()} Plans`,
          "Choose Plan",
          [{ title: "Plans", rows: rowss }]
        );

        user.state = STATES.SELECTING_PLAN;
        await user.save();
        return res.sendStatus(200);
      }

      if (user.state === STATES.SELECTING_PLAN) {
        user.tempData = user.tempData || {};
        user.tempData.planId = id;
        user.tempData.planTitle = title;
        user.markModified("tempData"); // <- mark modified

        await sendText(
          from,
          `You selected ${title}.\nEnter phone number (e.g. 08012345678)`
        );

        user.state = STATES.ENTER_PHONE;
        await user.save();
        return res.sendStatus(200);
      }

      return res.sendStatus(200);
    }

    if (user.state === STATES.ENTER_PHONE && message?.text?.body) {
      let phone = text.trim();

      // Validate
      if (!/^0\d{10}$/.test(phone)) {
        await sendText(
          from,
          "Invalid phone number.\nEnter an 11-digit number like 08012345678."
        );
        return res.sendStatus(200);
      }

      user.tempData = user.tempData || {};
      user.tempData.beneficiaryPhone = phone;
      user.markModified("tempData");

      const plan = plan_map[user.tempData.planId];

      if (!plan) {
        await sendText(from, "Invalid plan. Restarting...");
        user.state = STATES.MAIN_MENU;
        user.tempData = {};
        user.markModified("tempData");
        await user.save();
        return res.sendStatus(200);
      }

      await sendText(
        from,
        `Your purchase request:\n\nNetwork: ${user.tempData.network}\nPlan: ${user.tempData.planTitle}\nAmount: ₦${plan.amount}\nPhone: ${phone}\n\nThe number will be credited soon.`
      );

      // Optional: Save Purchase
      // await Purchase.create(...)

      user.state = STATES.MAIN_MENU;
      user.tempData = {};
      user.markModified("tempData");
      await user.save();
      return res.sendStatus(200);
    }

    if (user.state === STATES.MAIN_MENU) {
      await sendButtons(from, "What can I do for you?", MAIN_MENU_BUTTONS);
      return res.sendStatus(200);
    }

    await sendButtons(from, "What can I do for you?", MAIN_MENU_BUTTONS);
    return res.sendStatus(200);
  } catch (err) {
    console.error("ERROR in webhook:", err);
    const from =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from || null;

    if (from) await sendText(from, "An error occurred.");

    return res.sendStatus(500);
  }
});

export default router;

// import express from "express";
// import UserState from "../Models/UserState.js";
// import Purchase from "../Models/Purchase.js";
// import AuditLog from "../Models/AuditLog.js";
// import { sendButtons, sendList, sendText } from "../services/whatsapp.js";
// import { STATES } from "../services/fsm.js";
// import { MAIN_MENU_BUTTONS } from "../utils/templates.js";
// import { PLAN_MAP } from "../utils/planMap.js";
// // import { responseMessage } from "../controller/webhookController.js";

// const router = express.Router();

// router.post("/webhook", async (req, res) => {
//   try {
//     const entry = req.body.entry?.[0];
//     const changes = entry?.changes?.[0];
//     const value = changes?.value;

//     const message = value?.messages?.[0];
//     const from = message?.from;

//     if (!message) {
//       console.log("No user message ignoring.");
//       return res.sendStatus(200);
//     }

//     const text =
//       message?.text?.body ||
//       message?.interactive?.button_reply?.id ||
//       message?.interactive?.list_reply?.id;

//     const button = message?.interactive?.button_reply;
//     const list = message?.interactive?.list_reply;

//     if (text) {
//       const chat = text.toLowerCase().trim();

//       if (chat === "hi" || chat === "hello") {
//         await sendButtons(from, `What can i do for you?`, MAIN_MENU_BUTTONS);

//         return res.sendStatus(200);
//       }
//     }

//     // looks for user or create if not
//     let user =
//       (await UserState.findOne({ phone: from })) ||
//       (await UserState.create({ phone: from }));

//     await user.save();

//     const now = Date.now();
//     const MENU_TIMEOUT_SECONDS = 300;
//     const timeoutSeconds = Number(MENU_TIMEOUT_SECONDS || 300);
//     // if (now - new Date(user.lastUpdated).getTime() > timeoutSeconds * 1000) {
//     //   user.state = STATES.MAIN_MENU;
//     //   user.tempData = {};
//     //   user.lastUpdated = new Date();
//     //   await user.save();

//     //   await sendText(from, "Session expired, starting over.");
//     //   return res.sendStatus(200);
//     // }

//     const touch = async () => {
//       user.lastUpdated = new Date();
//       await user.save();
//     };

//     if (button) {
//       const id = button.id;

//       if (id === "buy_data") {
//         await sendButtons(from, "Choose network:", [
//           { type: "reply", reply: { id: "network_mtn", title: "MTN" } },
//           { type: "reply", reply: { id: "network_airtel", title: "Airtel" } },
//         ]);
//         user.state = STATES.SELECTING_NETWORK;
//         await touch();
//         return res.sendStatus(200);
//       }

//       if (id === "buy_airtime") {
//         await sendList(from, "Airtime Amounts", "Choose amount", [
//           {
//             title: "Amounts",
//             rows: [
//               { id: "amt_100", title: "₦100" },
//               { id: "amt_500", title: "₦500" },
//             ],
//           },
//         ]);
//         user.state = STATES.SELECTING_PLAN;
//         await touch();
//         return res.sendStatus(200);
//       }

//       if (id === "support") {
//         await sendText(
//           from,
//           "Support coming soon — chat with our agent at +2349026645775"
//         );
//         return res.sendStatus(200);
//       }
//     }

//     //  LIST REPLIES
//     // if (list) {
//     //   const id = list.id;
//     //   await sendText(from, `You selected: ${id}`);
//     //   return res.sendStatus(200);
//     // }
//     if (list) {
//       const id = list.id;
//       const title = list.title;

//       // Selecting Network
//       if (user.state === STATES.SELECTING_NETWORK) {
//         // user.tempData.network = id.includes("mtn") ? "MTN" : "Airtel";

//         // const rowss = Object.entries(PLAN_MAP).map(([key, v]) => ({
//         //   id: key,
//         //   title: v.desc,
//         // }));

//         // await sendList(from, `MTN Plans`, "Choose a plan", [
//         //   {
//         //     title: "Plans",
//         //     rows: rowss,
//         //   },
//         // ]);
//         await sendText(from, "at selecting state");

//         user.state = STATES.SELECTING_PLAN;
//         // user.markModified("tempData");
//         await user.save();
//         await touch();
//         return res.sendStatus(200);
//       }

//       // Selecting Plan
//       if (user.state === STATES.SELECTING_PLAN) {
//         user.tempData.planId = id;
//         user.tempData.planTitle = title;

//         await sendText(
//           from,
//           `You selected ${title}.\nEnter the phone number to load (e.g. 08012345678)`
//         );

//         user.state = STATES.ENTER_PHONE;

//         user.markModified("tempData");
//         await user.save();
//         await touch();
//         return res.sendStatus(200);
//       }
//       let phone_number = text.trim();
//       if (phone_number && user.state === STATES.ENTER_PHONE) {
//         // Validate phone number
//         if (!/^0\d{10}$/.test(phone_number)) {
//           await sendText(
//             from,
//             "Invalid phone number.\nEnter an 11-digit number like 08012345678."
//           );
//           return res.sendStatus(200);
//         }

//         user.tempData.beneficiaryPhone = text;

//         const plan = PLAN_MAP[user.tempData.planId];
//         if (!plan) {
//           await sendText(from, "Invalid plan. Restarting...");
//           user.state = STATES.MAIN_MENU;
//           user.tempData = {};
//           await touch();
//           return res.sendStatus(200);
//         }
//         await sendText(
//           from,
//           `the following number \n${phone_number} will credit soon.`
//         );
//         return res.sendStatus(200);

//         //       const purchase = await Purchase.create({
//         //         phone: from,
//         //         userPhoneInput: text,
//         //         planId: user.tempData.planId,
//         //         planTitle: user.tempData.planTitle,
//         //         network: user.tempData.network,
//         //         amount: plan.amount,
//         //         paymentProvider: "paystack",
//         //       });

//         //       // (Payment initialization removed for now)
//         //       await purchase.save();

//         //       await sendText(
//         //         from,
//         //         "To complete purchase, pay here: (payment link coming)"
//         //       );
//         //       user.state = STATES.AWAITING_PAYMENT;
//         //       await touch();
//         //       return res.sendStatus(200);
//       }
//     }
//   } catch (err) {
//     const entry = req.body.entry?.[0];
//     const msg = entry?.changes?.[0]?.value?.messages?.[0];
//     const from = msg.from;

//     await sendText(from, `error: ${err}`);
//     console.error("WebhookController error", err);
//     res.sendStatus(500);
//   }
// });

// export default router;

// // import { dataPurchaseProcess } from "../controller/webhookController.js";

// // const router = e.Router();
// // // router.get("/webhook", verifyWebhookFromWhatsapp);
// // // router.post(
// // //   "/webhook",
// // //   express.raw({ type: "application/json" }),
// // //   createProduct
// // // );

// // // router.get("/webhook", dataPurchaseProcess);
// // router.post("/webhook", dataPurchaseProcess);

// // export default router;
