// // import { response } from "express";
import dotenv from "dotenv";
dotenv.config();

// export const availableDataPlans = async (to) => {
//   const res = await fetch(
//     `https://graph.facebook.com/v22.0/886326117894676/messages`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.WAB_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         messaging_product: "whatsapp",
//         to: `${to}`,
//         type: "interactive",
//         interactive: {
//           type: "button",
//           body: {
//             text: "Available Plans",
//           },
//           action: {
//             buttons: [
//               {
//                 type: "reply",
//                 reply: {
//                   id: "500mb_299",
//                   title: ` 500MB ${new Intl.NumberFormat("en-NG", {
//                     style: "currency",
//                     currency: "NGN",
//                     minimumFractionDigits: 0,
//                     maximumFractionDigits: 0,
//                   }).format(299)}`,
//                 },
//               },
//               {
//                 type: "reply",
//                 reply: {
//                   id: "1gb_379",
//                   title: ` 1GB ${new Intl.NumberFormat("en-NG", {
//                     style: "currency",
//                     currency: "NGN",
//                     minimumFractionDigits: 0,
//                     maximumFractionDigits: 0,
//                   }).format(379)}`,
//                 },
//               },
//             ],
//           },
//         },
//       }),
//     }
//   );
//   return res.sendStatus(200);
// };

// export const askForPhoneNumber = async (to) => {
//   const res = await fetch(
//     `https://graph.facebook.com/v22.0/886326117894676/messages`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.WAB_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         messaging_product: "whatsapp",
//         to: `${to}`,
//         type: "text",
//         text: {
//           body: "Provide your phone number to proceed with the purchase.",
//         },
//       }),
//     }
//   );
//   return res.sendStatus(200);
// };

// export const purchaseSuccessful = (to) => {
//   fetch(`https://graph.facebook.com/v22.0/886326117894676/messages`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.WAB_API_TOKEN}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       messaging_product: "whatsapp",
//       to: `${to}`,
//       type: "text",
//       text: {
//         body: "Purchase successful! Your data plan will be activated shortly.",
//       },
//     }),
//   });
//   return res.sendStatus(200);
// };

export const availableDataPlans = async (user) => {
  try {
    return await fetch(
      `https://graph.facebook.com/v22.0/886326117894676/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WAB_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: `${user}`,
          type: "interactive",
          interactive: {
            type: "button",
            body: {
              text: "Available Data Plans",
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: "500mb_299",
                    title: `500MB ${new Intl.NumberFormat("en-NG", {
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
                    title: `1GB ${new Intl.NumberFormat("en-NG", {
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
  } catch (error) {
    return await fetch(
      `https://graph.facebook.com/v22.0/886326117894676/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WAB_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: `${user}`,
          type: "text",
          text: {
            body: "Hello! This is a custom message instead of a template.d",
          },
        }),
      }
    );
  }
};

// console.log(await availableDataPlans("2347063255405"));

export const askForPhoneNumber = async (to) => {
  return await fetch(
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
};

export const purchaseSuccessful = async (to) => {
  return await fetch(
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
          body: "Purchase successful! Your data plan will be activated shortly.",
        },
      }),
    }
  );
};
