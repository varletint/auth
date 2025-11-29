import express from "express";
import { getUserById } from "../controller/userController.js";

const router = express.Router();

// Get user by ID (public route - no authentication required)
router.get("/:id", getUserById);

export default router;
