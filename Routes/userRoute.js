import express from "express";
import { getUserById, getProfileStats } from "../controller/userController.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

// Get profile stats for authenticated user (must be before /:id to avoid conflict)
router.get("/profile-stats", verifyToken, getProfileStats);

// Get user by ID (public route - no authentication required)
router.get("/:id", getUserById);

export default router;
