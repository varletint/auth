import UserState from "../Models/UserState.js";
import Purchase from "../Models/Purchase.js";
import AuditLog from "../Models/AuditLog.js";
import { sendButtons, sendList, sendText } from "../services/whatsapp.js";
import { STATES } from "../services/fsm.js";
import { PLAN_MAP } from "../utils/planMap.js";
import { MAIN_MENU_BUTTONS } from "../utils/templates.js";

export const responseMessage = async (req, res) => {
  try {
    // Save webhook for debugging (non-blocking)
    AuditLog.create({ type: "webhook", payload: req.body }).catch(() => {});

    // Safely extract message
    const entry = req.body.entry?.[0];
    const msg = entry?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    const from = msg.from;

    // Load or create user state
    let user =
      (await UserState.findOne({ phone: from })) ||
      (await UserState.create({ phone: from }));
    await user.save();

    const now = Date.now();

    // const textHI = msg.text.body.trim();

    // if (textHI.toLowerCase() === "hi") {
    //   await sendButtons(from, `${from}, your are Welcome`, MAIN_MENU_BUTTONS);

    //   user.state = STATES.MAIN_MENU;
    //   // await touch();
    //   return res.sendStatus(200);
    // }

    // ------------------------------
    //  SESSION TIMEOUT HANDLING
    // ------------------------------
    const timeoutSeconds = Number(process.env.MENU_TIMEOUT_SECONDS || 300);
    if (now - new Date(user.lastUpdated).getTime() > timeoutSeconds * 1000) {
      user.state = STATES.MAIN_MENU;
      user.tempData = {};
      user.lastUpdated = new Date();
      await user.save();

      await sendText(from, "Session expired — starting over.");
      return res.sendStatus(200);
    }

    // Helper: Update timestamp on every action
    const touch = async () => {
      user.lastUpdated = new Date();
      await user.save();
    };

    // ------------------------------
    //  BUTTON REPLIES
    // ------------------------------
    const button = msg?.interactive?.button_reply;
    if (button) {
      const id = button.id;

      // BUY DATA
      if (id === "buy_data") {
        await sendButtons(from, "Choose network:", [
          { type: "reply", reply: { id: "network_mtn", title: "MTN" } },
          { type: "reply", reply: { id: "network_airtel", title: "Airtel" } },
        ]);

        user.state = STATES.SELECTING_NETWORK;
        await touch();
        return res.sendStatus(200);
      }

      // BUY AIRTIME
      if (id === "buy_airtime") {
        await sendList(from, "Airtime Amounts", "Choose amount", [
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

      // SUPPORT
      if (id === "support") {
        await sendText(
          from,
          "Support coming soon — chat with our agent at +2349026645775"
        );
        await touch();
        return res.sendStatus(200);
      }
    }

    // ------------------------------
    //  LIST REPLIES
    // ------------------------------
    const list = msg?.interactive?.list_reply;
    if (list) {
      const id = list.id;
      const title = list.title;

      // Selecting Network
      if (user.state === STATES.SELECTING_NETWORK) {
        user.tempData.network = id.includes("mtn") ? "MTN" : "Airtel";

        const rows = Object.entries(PLAN_MAP).map(([key, v]) => ({
          id: key,
          title: v.desc,
        }));

        await sendList(
          from,
          `${user.tempData.network} Plans`,
          "Choose a plan",
          [{ title: "Plans", rows }]
        );

        user.state = STATES.SELECTING_PLAN;
        await touch();
        return res.sendStatus(200);
      }

      // Selecting Plan
      if (user.state === STATES.SELECTING_PLAN) {
        user.tempData.planId = id;
        user.tempData.planTitle = title;

        await sendText(
          from,
          `You selected ${title}.\nEnter the phone number to load (e.g. 08012345678)`
        );

        user.state = STATES.ENTER_PHONE;
        await touch();
        return res.sendStatus(200);
      }
    }

    // ------------------------------
    //  TEXT INPUT (ENTERING PHONE)
    // ------------------------------
    const text =
      typeof msg?.text?.body === "string" ? msg.text.body.trim() : null;

    if (text && user.state === STATES.ENTER_PHONE) {
      // Validate phone number
      if (!/^0\d{10}$/.test(text)) {
        await sendText(
          from,
          "Invalid phone number.\nEnter an 11-digit number like 08012345678."
        );
        return res.sendStatus(200);
      }

      user.tempData.beneficiaryPhone = text;

      const plan = PLAN_MAP[user.tempData.planId];
      if (!plan) {
        await sendText(from, "Invalid plan. Restarting...");
        user.state = STATES.MAIN_MENU;
        user.tempData = {};
        await touch();
        return res.sendStatus(200);
      }

      const purchase = await Purchase.create({
        phone: from,
        userPhoneInput: text,
        planId: user.tempData.planId,
        planTitle: user.tempData.planTitle,
        network: user.tempData.network,
        amount: plan.amount,
        paymentProvider: "paystack",
      });

      // (Payment initialization removed for now)
      await purchase.save();

      await sendText(
        from,
        "To complete purchase, pay here: (payment link coming)"
      );
      user.state = STATES.AWAITING_PAYMENT;
      await touch();
      return res.sendStatus(200);
    }

    // ------------------------------
    //  DEFAULT — Show Main Menu
    // ------------------------------
    await sendButtons(from, `${from}, your are Welcome`, MAIN_MENU_BUTTONS);

    user.state = STATES.MAIN_MENU;
    await touch();
    return res.sendStatus(200);
  } catch (err) {
    const entry = req.body.entry?.[0];
    const msg = entry?.changes?.[0]?.value?.messages?.[0];
    const from = msg.from;

    await sendText(from, `error: ${err}`);
    console.error("WebhookController error", err);
    res.sendStatus(500);
  }
};

// bals

// import UserState from "../Models/UserState.js";
// import Purchase from "../Models/Purchase.js";
// import AuditLog from "../Models/AuditLog.js";
// import { sendButtons, sendList, sendText } from "../services/whatsapp.js";
// import { STATES } from "../services/fsm.js";
// // import { initPaystackPayment } from "../services/payments/paystack.js";
// import { PLAN_MAP } from "../utils/planMap.js";
// import { MAIN_MENU_BUTTONS } from "../utils/templates.js";

// export const responseMessage = async (req, res) => {
//   try {
//     // Save raw webhook for debugging
//     await AuditLog.create({ type: "webhook", payload: req.body });

//     const entry = req.body.entry?.[0];
//     const msg = entry?.changes?.[0]?.value?.messages?.[0];
//     if (!msg) return res.sendStatus(200);

//     const from = msg.from;
//     let user =
//       (await UserState.findOne({ phone: from })) ||
//       (await UserState.create({ phone: from }));

//     // timeout reset
//     const timeoutSeconds = Number(process.env.MENU_TIMEOUT_SECONDS || 300);
//     if (
//       Date.now() - new Date(user.lastUpdated).getTime() >
//       timeoutSeconds * 1000
//     ) {
//       user.state = STATES.MAIN_MENU;
//       user.tempData = {};
//       user.lastUpdated = new Date();
//       await user.save();
//       await sendText(from, "Session expired — starting over.");
//       return res.sendStatus(200);
//     }

//     // Interactive button reply
//     if (msg.type === "interactive" && msg.interactive.button_reply) {
//       const id = msg.interactive.button_reply.id;

//       if (id === "buy_data") {
//         await sendButtons(from, "Choose network:", [
//           { type: "reply", reply: { id: "network_mtn", title: "MTN" } },
//           { type: "reply", reply: { id: "network_airtel", title: "Airtel" } },
//         ]);
//         user.state = STATES.SELECTING_NETWORK;
//         user.lastUpdated = new Date();
//         await user.save();
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
//         user.lastUpdated = new Date();
//         await user.save();
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

//     // Interactive list reply
//     if (msg.type === "interactive" && msg.interactive.list_reply) {
//       const id = msg.interactive.list_reply.id;
//       const title = msg.interactive.list_reply.title;

//       if (user.state === STATES.SELECTING_NETWORK) {
//         user.tempData.network = id.includes("mtn") ? "MTN" : "Airtel";
//         const rows = Object.entries(PLAN_MAP).map(([k, v]) => ({
//           id: k,
//           title: v.desc,
//         }));
//         await sendList(
//           from,
//           `${user.tempData.network} Plans`,
//           "Choose a plan",
//           [{ title: "Plans", rows }]
//         );
//         user.state = STATES.SELECTING_PLAN;
//         user.lastUpdated = new Date();
//         await user.save();
//         return res.sendStatus(200);
//       }

//       if (user.state === STATES.SELECTING_PLAN) {
//         user.tempData.planId = id;
//         user.tempData.planTitle = title;
//         await sendText(
//           from,
//           `You selected ${title}.\nPlease enter the phone number to load (e.g. 0801xxxxxxx)`
//         );
//         user.state = STATES.ENTER_PHONE;
//         user.lastUpdated = new Date();
//         await user.save();
//         return res.sendStatus(200);
//       }
//     }

//     // Text input handling
//     const text = msg.text?.body?.trim();
//     if (text && user.state === STATES.ENTER_PHONE) {
//       user.tempData.beneficiaryPhone = text;

//       const plan = PLAN_MAP[user.tempData.planId] || {
//         amount: 500,
//         desc: user.tempData.planTitle,
//       };

//       const purchase = await Purchase.create({
//         phone: from,
//         userPhoneInput: text,
//         planId: user.tempData.planId,
//         planTitle: user.tempData.planTitle,
//         network: user.tempData.network,
//         amount: plan.amount,
//         paymentProvider: "paystack",
//       });

//       // Initialize payment
//       // const paymentInit = await initPaystackPayment({
//       //   email: `${from}@example.com`,
//       //   amount: plan.amount * 100,
//       //   reference: `ws_${purchase._id}`,
//       //   callback_url: `${process.env.APP_BASE_URL}/payments/paystack/callback`,
//       // });

//       // purchase.paymentReference =
//       //   paymentInit.data?.reference || paymentInit.reference;
//       // purchase.status = "pending";
//       await purchase.save();

//       await sendText(
//         from,
//         `To complete purchase pay here:`
//         // `To complete purchase pay here: /*${paymentInit.data?.authorization_url}/*`
//       );

//       user.state = STATES.AWAITING_PAYMENT;
//       user.lastUpdated = new Date();
//       await user.save();

//       return res.sendStatus(200);
//     }

//     // default: show main menu
//     await sendButtons(from, "Welcome — choose an option:", MAIN_MENU_BUTTONS);
//     user.state = STATES.MAIN_MENU;
//     user.lastUpdated = new Date();
//     await user.save();

//     return res.sendStatus(200);
//   } catch (err) {
//     console.error("WebhookController error", err);
//     res.sendStatus(500);
//   }
// };
