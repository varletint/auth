import BaseHandler from "./BaseHandler.js";
import { STATES } from "../fsm.js";

export default class PlanSelectionHandler extends BaseHandler {
    async handle() {
        const { user, message } = this;
        const from = user.phone;
        const listId = message?.interactive?.list_reply?.id;
        const title = message?.interactive?.list_reply?.title;

        if (listId) {
            user.tempData = user.tempData || {};
            user.tempData.planId = listId;
            user.tempData.planTitle = title;
            user.markModified("tempData");

            await this.sendText(
                from,
                `You selected ${title}.\nEnter phone number (e.g. 08012345678)`
            );

            user.state = STATES.ENTER_PHONE;
            await user.save();
        } else {
            // Fallback
            await this.sendText(from, "Please select a plan from the list.");
        }
    }
}
