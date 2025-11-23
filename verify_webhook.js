import axios from "axios";

const BASE_URL = "http://localhost:3000"; // Adjust port if needed

const mockWebhook = async (messageBody, type = "text") => {
    const payload = {
        entry: [
            {
                changes: [
                    {
                        value: {
                            messages: [
                                {
                                    from: "2348012345678",
                                    id: "wamid.HBgLM...",
                                    timestamp: "167...",
                                    type: type,
                                    [type]: messageBody,
                                    interactive: type === "interactive" ? messageBody : undefined,
                                    text: type === "text" ? { body: messageBody } : undefined,
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    try {
        const res = await axios.post(BASE_URL, payload);
        console.log(`Sent: ${JSON.stringify(messageBody)} - Status: ${res.status}`);
    } catch (err) {
        console.error(`Error sending: ${err.message}`);
    }
};

const runTests = async () => {
    console.log("Starting Webhook Verification...");

    // 1. Send "Hi"
    await mockWebhook("Hi");

    // 2. Select "Buy Data" (Button Reply)
    await mockWebhook(
        {
            type: "button_reply",
            button_reply: { id: "buy_data", title: "Buy Data" },
        },
        "interactive"
    );

    // 3. Select "MTN" (List Reply)
    await mockWebhook(
        {
            type: "list_reply",
            list_reply: { id: "network_mtn", title: "MTN" },
        },
        "interactive"
    );

    // 4. Select Plan (List Reply)
    await mockWebhook(
        {
            type: "list_reply",
            list_reply: { id: "plan_500", title: "500MB" },
        },
        "interactive"
    );

    // 5. Enter Phone Number
    await mockWebhook("08012345678");

    console.log("Verification requests sent. Check server logs for responses.");
};

runTests();
