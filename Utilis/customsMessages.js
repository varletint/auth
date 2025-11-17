// import { response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const availableDataPlans = async (to) => {
  const res = await fetch(
    `https://graph.facebook.com/v22.0/886326117894676/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WAB_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: `${to}`,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: "Available Plans",
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "500mb_299",
                  title: ` 500MB ${new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(299)}`,
                },
              },
              {
                type: "reply",
                reply: {
                  id: "1gb_379",
                  title: ` 1GB ${new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(379)}`,
                },
              },
            ],
          },
        },
      }),
    }
  );
  //   return res;
};

export const askForPhoneNumber = async (to) => {
  const res = await fetch(
    `https://graph.facebook.com/v22.0/886326117894676/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WAB_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: `${to}`,
        type: "text",
        text: {
          body: "Provide your phone number to proceed with the purchase.",
        },
      }),
    }
  );

  //   return res;
};
export const purchaseSuccessful = (to) => {
  fetch(`https://graph.facebook.com/v22.0/886326117894676/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WAB_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: `${to}`,
      type: "text",
      text: {
        body: "Purchase successful! Your data plan will be activated shortly.",
      },
    }),
  });
};
