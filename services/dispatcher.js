import { STATES } from "./fsm.js";
import MainMenuHandler from "./stateHandlers/MainMenuHandler.js";
import NetworkSelectionHandler from "./stateHandlers/NetworkSelectionHandler.js";
import PlanSelectionHandler from "./stateHandlers/PlanSelectionHandler.js";
import PhoneEntryHandler from "./stateHandlers/PhoneEntryHandler.js";

const HANDLERS = {
    [STATES.MAIN_MENU]: MainMenuHandler,
    [STATES.SELECTING_NETWORK]: NetworkSelectionHandler,
    [STATES.SELECTING_PLAN]: PlanSelectionHandler,
    [STATES.ENTER_PHONE]: PhoneEntryHandler,
};

export const dispatch = async (user, message) => {
    const HandlerClass = HANDLERS[user.state] || MainMenuHandler;
    const handler = new HandlerClass(user, message);
    await handler.handle();
};
