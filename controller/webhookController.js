import UserState from "../Models/UserState.js";
import Purchase from "../Models/Purchase.js";
import AuditLog from "../Models/AuditLog.js";
import { sendButtons, sendList, sendText } from "../services/whatsapp.js";
import { STATES } from "../services/fsm.js";
// import { initPaystackPayment } from "../services/payments/paystack.js";
import { PLAN_MAP } from "../utils/planMap.js";
import { MAIN_MENU_BUTTONS } from "../utils/templates.js";

export const responseMessage = async (req, res) => {
  try {
    // Save raw webhook for debugging
    await AuditLog.create({ type: "webhook", payload: req.body });

    const entry = req.body.entry?.[0];
    const msg = entry?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    const from = msg.from;
    let user =
      (await UserState.findOne({ phone: from })) ||
      (await UserState.create({ phone: from }));

    // timeout reset
    const timeoutSeconds = Number(process.env.MENU_TIMEOUT_SECONDS || 300);
    if (
      Date.now() - new Date(user.lastUpdated).getTime() >
      timeoutSeconds * 1000
    ) {
      user.state = STATES.MAIN_MENU;
      user.tempData = {};
      await user.save();
      await sendText(from, "Session expired — starting over.");
    }

    // Interactive button reply
    if (msg.type === "interactive" && msg.interactive.button_reply) {
      const id = msg.interactive.button_reply.id;

      if (id === "buy_data") {
        await sendButtons(from, "Choose network:", [
          { type: "reply", reply: { id: "network_mtn", title: "MTN" } },
          { type: "reply", reply: { id: "network_airtel", title: "Airtel" } },
        ]);
        user.state = STATES.SELECTING_NETWORK;
        await user.save();
        return res.sendStatus(200);
      }

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
        await user.save();
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

    // Interactive list reply
    if (msg.type === "interactive" && msg.interactive.list_reply) {
      const id = msg.interactive.list_reply.id;
      const title = msg.interactive.list_reply.title;

      if (user.state === STATES.SELECTING_NETWORK) {
        user.tempData.network = id.includes("mtn") ? "MTN" : "Airtel";
        const rows = Object.entries(PLAN_MAP).map(([k, v]) => ({
          id: k,
          title: v.desc,
        }));
        await sendList(
          from,
          `${user.tempData.network} Plans`,
          "Choose a plan",
          [{ title: "Plans", rows }]
        );
        user.state = STATES.SELECTING_PLAN;
        await user.save();
        return res.sendStatus(200);
      }

      if (user.state === STATES.SELECTING_PLAN) {
        user.tempData.planId = id;
        user.tempData.planTitle = title;
        await sendText(
          from,
          `You selected ${title}.\nPlease enter the phone number to load (e.g. 0801xxxxxxx)`
        );
        user.state = STATES.ENTER_PHONE;
        await user.save();
        return res.sendStatus(200);
      }
    }

    // Text input handling
    const text = msg.text?.body?.trim();
    if (text && user.state === STATES.ENTER_PHONE) {
      user.tempData.beneficiaryPhone = text;

      const plan = PLAN_MAP[user.tempData.planId] || {
        amount: 500,
        desc: user.tempData.planTitle,
      };

      const purchase = await Purchase.create({
        phone: from,
        userPhoneInput: text,
        planId: user.tempData.planId,
        planTitle: user.tempData.planTitle,
        network: user.tempData.network,
        amount: plan.amount,
        paymentProvider: "paystack",
      });

      // Initialize payment
      // const paymentInit = await initPaystackPayment({
      //   email: `${from}@example.com`,
      //   amount: plan.amount * 100,
      //   reference: `ws_${purchase._id}`,
      //   callback_url: `${process.env.APP_BASE_URL}/payments/paystack/callback`,
      // });

      // purchase.paymentReference =
      //   paymentInit.data?.reference || paymentInit.reference;
      // purchase.status = "pending";
      await purchase.save();

      await sendText(
        from,
        `To complete purchase pay here:`
        // `To complete purchase pay here: /*${paymentInit.data?.authorization_url}/*`
      );

      user.state = STATES.AWAITING_PAYMENT;
      await user.save();

      return res.sendStatus(200);
    }

    // default: show main menu
    await sendButtons(from, "Welcome — choose an option:", MAIN_MENU_BUTTONS);
    user.state = STATES.MAIN_MENU;
    await user.save();

    return res.sendStatus(200);
  } catch (err) {
    console.error("WebhookController error", err);
    res.sendStatus(500);
  }
};
