import e from "express";
import { createProduct } from "../controller/whatsapp.webhook.controller.js";

const router = e.Router();

router.post("/cp_from_webhook", createProduct);

export default router;
