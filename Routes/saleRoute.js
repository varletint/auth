import express from "express";
import { verifyBusinessOrStaff } from "../middleware/verifyStaff.js";
import {
    getSales,
    getSale,
    createSale,
    updateSale,
    deleteSale,
    getSalesStats,
} from "../controller/saleController.js";

const router = express.Router();

// All routes require business owner or staff authentication
router.use(verifyBusinessOrStaff);

// Stats route (must be before /:id to avoid conflict)
router.get("/stats", getSalesStats);

// CRUD routes
router.get("/", getSales);
router.get("/:id", getSale);
router.post("/", createSale);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

export default router;
