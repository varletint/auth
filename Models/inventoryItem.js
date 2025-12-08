import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema(
    {
        // ==================== User Reference ====================
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },

        // ==================== Item Details ====================
        name: {
            type: String,
            required: [true, "Item name is required"],
            trim: true,
            maxlength: [100, "Item name cannot exceed 100 characters"],
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },

        sku: {
            type: String,
            trim: true,
            uppercase: true,
            maxlength: [50, "SKU cannot exceed 50 characters"],
        },

        category: {
            type: String,
            trim: true,
            maxlength: [50, "Category cannot exceed 50 characters"],
            default: "General",
        },

        // ==================== Pricing ====================
        costPrice: {
            type: Number,
            required: [true, "Cost price is required"],
            min: [0, "Cost price cannot be negative"],
        },

        sellingPrice: {
            type: Number,
            required: [true, "Selling price is required"],
            min: [0, "Selling price cannot be negative"],
        },

        // ==================== Stock ====================
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [0, "Quantity cannot be negative"],
            default: 0,
        },

        lowStockThreshold: {
            type: Number,
            min: [0, "Low stock threshold cannot be negative"],
            default: 5,
        },

        unit: {
            type: String,
            trim: true,
            default: "pieces",
            enum: ["pieces", "kg", "g", "liters", "ml", "meters", "boxes", "packs", "dozen", "other"],
        },

        // ==================== Status ====================
        isActive: {
            type: Boolean,
            default: true,
        },

        // ==================== Soft Delete ====================
        isDeleted: {
            type: Boolean,
            default: false,
        },

        // ==================== Stock History ====================
        stockHistory: [
            {
                type: {
                    type: String,
                    enum: ["in", "out", "adjustment"],
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                reason: {
                    type: String,
                    trim: true,
                    maxlength: [200, "Reason cannot exceed 200 characters"],
                },
                referenceId: {
                    type: mongoose.Schema.Types.ObjectId,
                },
                referenceType: {
                    type: String,
                    enum: ["Sale", "Manual", "Initial"],
                },
                costPriceAtTime: {
                    type: Number,
                    min: 0,
                },
                sellingPriceAtTime: {
                    type: Number,
                    min: 0,
                },
                balanceAfter: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                valueAfter: {
                    type: Number,
                    min: 0,
                },
                idempotencyKey: {
                    type: String,
                    index: true,
                },
                createdBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ==================== Indexes ====================
inventoryItemSchema.index({ userId: 1, name: 1 });
inventoryItemSchema.index({ userId: 1, category: 1 });
inventoryItemSchema.index({ userId: 1, sku: 1 });
inventoryItemSchema.index({ userId: 1, isDeleted: 1 });

// ==================== Virtual Fields ====================
inventoryItemSchema.virtual("isLowStock").get(function () {
    return this.quantity <= this.lowStockThreshold;
});

inventoryItemSchema.virtual("profitMargin").get(function () {
    if (this.costPrice === 0) return 100;
    return ((this.sellingPrice - this.costPrice) / this.costPrice * 100).toFixed(2);
});

inventoryItemSchema.virtual("stockValue").get(function () {
    return this.quantity * this.costPrice;
});

inventoryItemSchema.virtual("totalStockIn").get(function () {
    if (!this.stockHistory || this.stockHistory.length === 0) return 0;
    return this.stockHistory
        .filter((h) => h.type === "in")
        .reduce((sum, h) => sum + h.quantity, 0);
});

inventoryItemSchema.virtual("totalStockOut").get(function () {
    if (!this.stockHistory || this.stockHistory.length === 0) return 0;
    return this.stockHistory
        .filter((h) => h.type === "out")
        .reduce((sum, h) => sum + Math.abs(h.quantity), 0);
});

// ==================== Query Middleware ====================
inventoryItemSchema.pre(/^find/, function (next) {
    if (!this.getOptions().includeDeleted) {
        this.find({ isDeleted: { $ne: true } });
    }
    next();
});

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

export default InventoryItem;
