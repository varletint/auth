import express from "express";
import { verifyToken } from "../middleware/verifyUser.js";
import {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerStats,
} from "../controller/customerController.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Stats route (must be before /:id to avoid conflict)
router.get("/stats", getCustomerStats);

// CRUD routes
router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
