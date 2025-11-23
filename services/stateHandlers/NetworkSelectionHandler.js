import BaseHandler from "./BaseHandler.js";
import { STATES } from "../fsm.js";
import { PLAN_MAP } from "../../utils/planMap.js";

export default class NetworkSelectionHandler extends BaseHandler {
    async handle() {
        const { user, message } = this;
        const from = user.phone;
        const listId = message?.interactive?.list_reply?.id;

        if (listId) {
            user.tempData = user.tempData || {};
            user.tempData.network = listId.includes("mtn")
                ? "MTN".toLowerCase()
                : "Airtel".toLowerCase();
            user.markModified("tempData");

            const rowss = Object.entries(PLAN_MAP).map(([key, v]) => ({
                id: key,
                title: v.desc,
            }));

            await this.sendList(
                from,
                `${user.tempData.network.toUpperCase()} Plans`,
                "Choose Plan",
                [{ title: "Plans", rows: rowss }]
            );

            user.state = STATES.SELECTING_PLAN;
            await user.save();
        } else {
            // Fallback if they send text instead of selecting list
            await this.sendText(from, "Please select a network from the list.");
        }
    }
}
