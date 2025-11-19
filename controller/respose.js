import dotenv from "dotenv";

dotenv.config();

const sendHello = async () => {
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
          //   messaging_product: "whatsapp",
          //   to: "2347063255405",
          //   type: "text",
          //   text: {
          //     body: "Hello! This is a custom message instead of a template.d",
          //   },

          messaging_product: "whatsapp",
          to: "2347063255405",
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
  } catch (error) {
    console.log("Error sending message:", error);
  }

  // console.log(res.body);
};

console.log(await sendHello());
