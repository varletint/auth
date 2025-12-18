import express from "express";
import { verifyBusinessOrStaff, verifyStaffPermission } from "../middleware/verifyStaff.js";
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
router.get("/", verifyStaffPermission("view_sales"), getSales);
router.get("/:id", verifyStaffPermission("view_sales"), getSale);
router.post("/", verifyStaffPermission("create_sale"), createSale);
router.put("/:id", verifyStaffPermission("create_sale"), updateSale);
router.delete("/:id", verifyStaffPermission("create_sale"), deleteSale);

export default router;
