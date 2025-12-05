import express from "express";
import { applyForSeller, getApplicationStatus } from "../controller/sellerApplicationController.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

// Apply for seller role (protected)
router.post("/apply", verifyToken, applyForSeller);

// Get application status (protected)
router.get("/status", verifyToken, getApplicationStatus);

export default router;
