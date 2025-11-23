import BaseHandler from "./BaseHandler.js";
import { STATES } from "../fsm.js";
import { PLAN_MAP } from "../../utils/planMap.js";

export default class PhoneEntryHandler extends BaseHandler {
    async handle() {
        const { user, message } = this;
        const from = user.phone;
        const text = message?.text?.body?.trim();

        if (!text) {
            await this.sendText(from, "Please enter a valid phone number.");
            return;
        }

        if (!/^0\d{10}$/.test(text)) {
            await this.sendText(
                from,
                "Invalid phone number.\nEnter an 11-digit number like 08012345678."
            );
            return;
        }

        user.tempData = user.tempData || {};
        user.tempData.beneficiaryPhone = text;
        user.markModified("tempData");

        const plan = PLAN_MAP[user.tempData.planId];

        if (!plan) {
            await this.sendText(from, "Invalid plan. Restarting...");
            user.state = STATES.MAIN_MENU;
            user.tempData = {};
            user.markModified("tempData");
            await user.save();
            return;
        }

        await this.sendText(
            from,
            `Your purchase request:\n\nNetwork: ${user.tempData.network?.toUpperCase() || 'N/A'}\nPlan: ${user.tempData.planTitle}\nAmount: ₦${plan.amount}\nPhone: ${text}\n\nThe number will be credited soon.`
        );

        user.state = STATES.MAIN_MENU;
        user.tempData = {};
        user.markModified("tempData");
        await user.save();
    }
}
