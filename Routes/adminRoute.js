import express from "express";
import { getStats, getAllUsers, getAllProducts } from "../controller/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyUser.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(verifyToken, verifyAdmin);

// Dashboard stats
router.get("/stats", getStats);

// User management
router.get("/users", getAllUsers);

// Product management
router.get("/products", getAllProducts);

export default router;
