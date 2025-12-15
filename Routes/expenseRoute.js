import express from "express";
import { verifyBusinessOrStaff } from "../middleware/verifyStaff.js";
import {
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats,
} from "../controller/expenseController.js";

const router = express.Router();

// All routes require business owner or staff authentication
router.use(verifyBusinessOrStaff);

// Stats route (must be before /:id to avoid conflict)
router.get("/stats", getExpenseStats);

// CRUD routes
router.get("/", getExpenses);
router.get("/:id", getExpense);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
