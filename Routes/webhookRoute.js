import express from "express";
import { handleIncomingWebhook, verifyWebhook } from "../controller/webhookController.js";

const router = express.Router();

router.post("/webhook", handleIncomingWebhook);
router.get("/webhook", verifyWebhook);

export default router;
