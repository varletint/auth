import express from "express";
import { verifyBusinessOrStaff } from "../middleware/verifyStaff.js";
import {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerStats,
} from "../controller/customerController.js";

const router = express.Router();

// All routes require business owner or staff authentication
router.use(verifyBusinessOrStaff);

// Stats route (must be before /:id to avoid conflict)
router.get("/stats", getCustomerStats);

// CRUD routes
router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
