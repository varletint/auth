import express from "express";
import { verifyToken } from "../middleware/verifyUser.js";
import {
    getSales,
    getSale,
    createSale,
    updateSale,
    deleteSale,
    getSalesStats,
} from "../controller/saleController.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Stats route (must be before /:id to avoid conflict)
router.get("/stats", getSalesStats);

// CRUD routes
router.get("/", getSales);
router.get("/:id", getSale);
router.post("/", createSale);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

export default router;
