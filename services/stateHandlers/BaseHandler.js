export default class BaseHandler {
    constructor(user, message) {
        this.user = user;
        this.message = message;
    }

    async handle() {
        throw new Error("Handle method must be implemented");
    }

    async sendText(to, text) {
        const { sendText } = await import("../whatsapp.js");
        return sendText(to, text);
    }

    async sendButtons(to, text, buttons) {
        const { sendButtons } = await import("../whatsapp.js");
        return sendButtons(to, text, buttons);
    }

    async sendList(to, header, text, sections) {
        const { sendList } = await import("../whatsapp.js");
        return sendList(to, header, text, sections);
    }
}
