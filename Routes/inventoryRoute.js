import express from "express";
import { verifyToken } from "../middleware/verifyUser.js";
import {
    getInventoryItems,
    getInventoryItem,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    restockInventoryItem,
    getInventoryStats,
} from "../controller/inventoryController.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Stats route (must be before /:id to avoid conflict)
router.get("/stats", getInventoryStats);

// CRUD routes
router.get("/", getInventoryItems);
router.get("/:id", getInventoryItem);
router.post("/", createInventoryItem);
router.put("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);

// Restock route
router.patch("/:id/restock", restockInventoryItem);

export default router;
