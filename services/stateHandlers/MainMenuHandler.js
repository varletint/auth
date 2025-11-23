import BaseHandler from "./BaseHandler.js";
import { STATES } from "../fsm.js";
import { MAIN_MENU_BUTTONS } from "../../utils/templates.js";

export default class MainMenuHandler extends BaseHandler {
    async handle() {
        const { user, message } = this;
        const from = user.phone;
        const buttonId = message?.interactive?.button_reply?.id;
        const text = message?.text?.body?.toLowerCase()?.trim();

        // Handle "Hi" / "Hello" or any text to show menu
        if (text === "hi" || text === "hello") {
            await this.sendButtons(from, "What can I do for you?", MAIN_MENU_BUTTONS);
            return;
        }

        if (buttonId) {
            if (buttonId === "buy_data") {
                await this.sendList(from, "Network", "Select Network", [
                    {
                        title: "Networks",
                        rows: [
                            { id: "mtn", title: "MTN" },
                            { id: "airtel", title: "Airtel" },
                        ],
                    },
                ]);
                user.state = STATES.SELECTING_NETWORK;
                await user.save();
                return;
            }

            if (buttonId === "buy_airtime") {
                await this.sendList(from, "Airtime Amounts", "Select Amount", [
                    {
                        title: "Amounts",
                        rows: [
                            { id: "amt_100", title: "₦100" },
                            { id: "amt_500", title: "₦500" },
                        ],
                    },
                ]);
                user.state = STATES.SELECTING_PLAN; // Reusing SELECTING_PLAN for airtime for now, or create new state
                await user.save();
                return;
            }

            if (buttonId === "support") {
                await this.sendText(
                    from,
                    "Support coming soon — chat with our agent at +2349026645775"
                );
                return;
            }
        }

        // Default fallback
        await this.sendButtons(from, "What can I do for you?", MAIN_MENU_BUTTONS);
    }
}
