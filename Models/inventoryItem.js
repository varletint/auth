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
            enum: ["pieces", "kg", "g", "liters", "ml", "meters", "boxes", "packs", "dozen", "carton", "bag", "bottle", "other"],
        },

        // ==================== Multi-Unit Configuration ====================
        // Toggle: Does this item have multiple selling units?
        hasMultipleUnits: {
            type: Boolean,
            default: false,
        },

        // For multi-unit items: the unit used to track stock internally
        baseUnit: {
            type: String,
            trim: true,
            enum: ["pieces", "kg", "g", "liters", "ml", "meters", "units", ""],
            default: "",
        },

        // For multi-unit items: stock quantity in base units
        baseQuantity: {
            type: Number,
            min: [0, "Base quantity cannot be negative"],
            default: 0,
        },

        // For multi-unit items: all available selling units with their conversion factors
        sellingUnits: [{
            name: {
                type: String,
                required: true,
                trim: true,
                // e.g., "kg", "bag", "cup", "carton"
            },
            label: {
                type: String,
                trim: true,
                // e.g., "Bag (5kg)", "Cup (500g)" for display
            },
            conversionFactor: {
                type: Number,
                required: true,
                min: [0.001, "Conversion factor must be positive"],
                // How many baseUnits in 1 of this selling unit
                // e.g., if baseUnit is "kg" and this is "bag (5kg)", factor = 5
            },
            costPrice: {
                type: Number,
                min: [0, "Cost price cannot be negative"],
                default: 0,
            },
            sellingPrice: {
                type: Number,
                required: true,
                min: [0, "Selling price cannot be negative"],
            },
            isDefault: {
                type: Boolean,
                default: false,
            },
        }],

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

        // ==================== Idempotency ====================
        idempotencyKey: {
            type: String,
            trim: true,
            index: true,
            // Unique per user - prevents duplicate item creation
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
// Unique idempotency key per user (sparse to allow nulls)
inventoryItemSchema.index({ userId: 1, idempotencyKey: 1 }, { unique: true, sparse: true });

// ==================== Virtual Fields ====================
inventoryItemSchema.virtual("isLowStock").get(function () {
    if (this.hasMultipleUnits) {
        return this.baseQuantity <= this.lowStockThreshold;
    }
    return this.quantity <= this.lowStockThreshold;
});

inventoryItemSchema.virtual("profitMargin").get(function () {
    if (this.hasMultipleUnits && this.sellingUnits?.length > 0) {
        const defaultUnit = this.sellingUnits.find(u => u.isDefault) || this.sellingUnits[0];
        if (defaultUnit.costPrice === 0) return 100;
        return ((defaultUnit.sellingPrice - defaultUnit.costPrice) / defaultUnit.costPrice * 100).toFixed(2);
    }
    if (this.costPrice === 0) return 100;
    return ((this.sellingPrice - this.costPrice) / this.costPrice * 100).toFixed(2);
});

inventoryItemSchema.virtual("stockValue").get(function () {
    if (this.hasMultipleUnits && this.sellingUnits?.length > 0) {
        const defaultUnit = this.sellingUnits.find(u => u.isDefault) || this.sellingUnits[0];
        return this.baseQuantity * (defaultUnit.costPrice / defaultUnit.conversionFactor);
    }
    return this.quantity * this.costPrice;
});

// Effective stock: returns the quantity in the appropriate unit
inventoryItemSchema.virtual("effectiveStock").get(function () {
    return this.hasMultipleUnits ? this.baseQuantity : this.quantity;
});

// Stock display: formatted string for UI
inventoryItemSchema.virtual("stockDisplay").get(function () {
    if (this.hasMultipleUnits) {
        return `${this.baseQuantity} ${this.baseUnit}`;
    }
    return `${this.quantity} ${this.unit}`;
});

// Default selling price for display
inventoryItemSchema.virtual("displayPrice").get(function () {
    if (this.hasMultipleUnits && this.sellingUnits?.length > 0) {
        const defaultUnit = this.sellingUnits.find(u => u.isDefault) || this.sellingUnits[0];
        return defaultUnit.sellingPrice;
    }
    return this.sellingPrice;
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
