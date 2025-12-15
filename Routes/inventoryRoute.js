import express from "express";
import { verifyBusinessOrStaff } from "../middleware/verifyStaff.js";
import {
    getInventoryItems,
    getInventoryItem,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    restockInventoryItem,
    stockOutInventoryItem,
    getItemWithHistory,
    getInventoryStats,
} from "../controller/inventoryController.js";

const router = express.Router();

// All routes require business owner or staff authentication
router.use(verifyBusinessOrStaff);

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

// Stock out route
router.patch("/:id/stock-out", stockOutInventoryItem);

// History route
router.get("/:id/history", getItemWithHistory);

export default router;
