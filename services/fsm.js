// every possible state a user can do
export const STATES = {
  START: "START",
  MAIN_MENU: "MAIN_MENU",
  SELECTING_NETWORK: "SELECTING_NETWORK",
  SELECTING_PLAN: "SELECTING_PLAN",
  ENTER_PHONE: "ENTER_PHONE",
  AWAITING_PAYMENT: "AWAITING_PAYMENT",
  DONE: "DONE",
  ERROR: "ERROR",
};

// each state contain its allowed action to do
// state  and what to do

export const TRANSITIONS = {
  [STATES.START]: { INIT: STATES.MAIN_MENU },
  [STATES.MAIN_MENU]: {
    CHOOSE_DATA: STATES.SELECTING_NETWORK,
    CHOOSE_AIRTIME: STATES.SELECTING_PLAN,
  },
  [STATES.SELECTING_NETWORK]: { NETWORK_CHOSEN: STATES.SELECTING_PLAN },
  [STATES.SELECTING_PLAN]: { PLAN_CHOSEN: STATES.ENTER_PHONE },
  [STATES.ENTER_PHONE]: { PHONE_ENTERED: STATES.AWAITING_PAYMENT },
  [STATES.AWAITING_PAYMENT]: {
    PAYMENT_CONFIRMED: STATES.DONE,
    PAYMENT_FAILED: STATES.ERROR,
  },
};

// define the current state and action to do to go to the next action if available. if not stay

//                          (state, what to do)
export const transition = (current, action) => {
  const next = TRANSITIONS[current]?.[action];
  return next || current;
};
