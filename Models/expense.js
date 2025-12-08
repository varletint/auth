import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        // ==================== User Reference (Business Owner) ====================
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },

        // ==================== Expense Details ====================
        title: {
            type: String,
            required: [true, "Expense title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "rent",
                "utilities",
                "salaries",
                "inventory",
                "transport",
                "marketing",
                "equipment",
                "maintenance",
                "taxes",
                "supplies",
                "other",
            ],
            default: "other",
        },

        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount cannot be negative"],
        },

        // ==================== Date ====================
        expenseDate: {
            type: Date,
            default: Date.now,
            index: true,
        },

        // ==================== Payment ====================
        paymentMethod: {
            type: String,
            enum: ["cash", "transfer", "card", "other"],
            default: "cash",
        },

        // ==================== Receipt/Reference ====================
        referenceNumber: {
            type: String,
            trim: true,
            maxlength: [50, "Reference number cannot exceed 50 characters"],
        },

        // ==================== Recurring ====================
        isRecurring: {
            type: Boolean,
            default: false,
        },

        recurringFrequency: {
            type: String,
            enum: ["daily", "weekly", "monthly", "yearly"],
        },

        // ==================== Soft Delete ====================
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ==================== Indexes ====================
expenseSchema.index({ userId: 1, expenseDate: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, isDeleted: 1 });

// ==================== Query Middleware ====================
expenseSchema.pre(/^find/, function (next) {
    if (!this.getOptions().includeDeleted) {
        this.find({ isDeleted: { $ne: true } });
    }
    next();
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
