import express from "express";
import { getUserById, getProfileStats } from "../controller/userController.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/profile-stats", verifyToken, getProfileStats);
router.get("/:id", getUserById);

export default router;
