import express from "express";
import {
    getStats,
    getAllUsers,
    getAllProducts,
    updateUserRole,
    toggleUserStatus,
    deleteUser
} from "../controller/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyUser.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(verifyToken, verifyAdmin);

// Dashboard stats
router.get("/stats", getStats);

// User management
router.get("/users", getAllUsers);
router.patch("/users/:userId/role", updateUserRole);
router.patch("/users/:userId/status", toggleUserStatus);
router.delete("/users/:userId", deleteUser);

// Product management
router.get("/products", getAllProducts);

export default router;
