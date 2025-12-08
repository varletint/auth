import Expense from "../Models/expense.js";
import { errorHandler } from "../Utilis/errorHandler.js";

/**
 * Get all expenses for a user
 * GET /api/expenses
 */
export const getExpenses = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, category, startDate, endDate } = req.query;

        const query = { userId };

        // Category filter
        if (category) {
            query.category = category;
        }

        // Date range filter
        if (startDate || endDate) {
            query.expenseDate = {};
            if (startDate) query.expenseDate.$gte = new Date(startDate);
            if (endDate) query.expenseDate.$lte = new Date(endDate);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const expenses = await Expense.find(query)
            .sort({ expenseDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalExpenses = await Expense.countDocuments(query);

        res.status(200).json({
            success: true,
            expenses,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalExpenses,
                totalPages: Math.ceil(totalExpenses / parseInt(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a single expense
 * GET /api/expenses/:id
 */
export const getExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const expense = await Expense.findOne({ _id: id, userId });

        if (!expense) {
            return next(errorHandler(404, "Expense not found"));
        }

        res.status(200).json({
            success: true,
            expense,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new expense
 * POST /api/expenses
 */
export const createExpense = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { title, description, category, amount, expenseDate, paymentMethod, referenceNumber, isRecurring, recurringFrequency } = req.body;

        if (!title || !amount) {
            return next(errorHandler(400, "Title and amount are required"));
        }

        const newExpense = new Expense({
            userId,
            title,
            description,
            category: category || "other",
            amount,
            expenseDate: expenseDate || new Date(),
            paymentMethod: paymentMethod || "cash",
            referenceNumber,
            isRecurring: isRecurring || false,
            recurringFrequency,
        });

        const savedExpense = await newExpense.save();

        res.status(201).json({
            success: true,
            message: "Expense recorded successfully",
            expense: savedExpense,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update an expense
 * PUT /api/expenses/:id
 */
export const updateExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const expense = await Expense.findOne({ _id: id, userId });

        if (!expense) {
            return next(errorHandler(404, "Expense not found"));
        }

        const allowedUpdates = ["title", "description", "category", "amount", "expenseDate", "paymentMethod", "referenceNumber", "isRecurring", "recurringFrequency"];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                expense[field] = req.body[field];
            }
        });

        const updatedExpense = await expense.save();

        res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense: updatedExpense,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete an expense (soft delete)
 * DELETE /api/expenses/:id
 */
export const deleteExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const expense = await Expense.findOne({ _id: id, userId });

        if (!expense) {
            return next(errorHandler(404, "Expense not found"));
        }

        expense.isDeleted = true;
        await expense.save();

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get expense summary/stats
 * GET /api/expenses/stats
 */
export const getExpenseStats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { period = "month" } = req.query;

        let startDate;
        const endDate = new Date();

        switch (period) {
            case "today":
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                break;
            case "week":
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case "month":
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case "year":
                startDate = new Date();
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
        }

        const expenses = await Expense.find({
            userId,
            expenseDate: { $gte: startDate, $lte: endDate },
        });

        const totalExpenses = expenses.length;
        const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

        // Category breakdown
        const categoryBreakdown = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        // Top expense categories
        const topCategories = Object.entries(categoryBreakdown)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([category, amount]) => ({ category, amount }));

        res.status(200).json({
            success: true,
            stats: {
                period,
                totalExpenses,
                totalAmount,
                categoryBreakdown,
                topCategories,
            },
        });
    } catch (error) {
        next(error);
    }
};
