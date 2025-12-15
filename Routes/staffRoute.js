import express from "express";
import {
    registerStaff,
    staffLogin,
    staffLogout,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
    getCurrentStaff,
} from "../controller/staffController.js";
import { verifyToken } from "../middleware/verifyUser.js";
import { verifyStaffToken, verifyBusinessOwner } from "../middleware/verifyStaff.js";

const router = express.Router();

// ==================== Public Routes ====================
// Staff login (no auth required)
router.post("/login", staffLogin);

// Staff logout
router.post("/logout", staffLogout);

// ==================== Staff Routes (Staff Token Required) ====================
// Get current logged-in staff info
router.get("/me", verifyStaffToken, getCurrentStaff);

// ==================== Business Owner Routes ====================
// Register new staff (business owner only)
router.post("/register", verifyToken, verifyBusinessOwner, registerStaff);

// Get all staff for business
router.get("/", verifyToken, verifyBusinessOwner, getAllStaff);

// Get single staff by ID
router.get("/:id", verifyToken, verifyBusinessOwner, getStaffById);

// Update staff
router.put("/:id", verifyToken, verifyBusinessOwner, updateStaff);

// Delete staff
router.delete("/:id", verifyToken, verifyBusinessOwner, deleteStaff);

export default router;
