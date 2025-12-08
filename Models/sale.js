import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
    {
        // ==================== User Reference (Business Owner) ====================
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },

        // ==================== Sale Items ====================
        items: [
            {
                inventoryItem: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "InventoryItem",
                },
                name: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity must be at least 1"],
                },
                unitPrice: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                costPrice: {
                    type: Number,
                    default: 0,
                    min: 0,
                },
                subtotal: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],

        // ==================== Customer ====================
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
        },

        customerName: {
            type: String,
            trim: true,
            maxlength: [100, "Customer name cannot exceed 100 characters"],
            default: "Walk-in Customer",
        },

        // ==================== Payment ====================
        totalAmount: {
            type: Number,
            required: [true, "Total amount is required"],
            min: [0, "Total amount cannot be negative"],
        },

        totalCost: {
            type: Number,
            default: 0,
            min: 0,
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "transfer", "card", "credit", "other"],
            default: "cash",
        },

        paymentStatus: {
            type: String,
            enum: ["paid", "pending", "partial"],
            default: "paid",
        },

        amountPaid: {
            type: Number,
            min: 0,
            default: function () {
                return this.totalAmount;
            },
        },

        // ==================== Sale Details ====================
        saleDate: {
            type: Date,
            default: Date.now,
            index: true,
        },

        notes: {
            type: String,
            trim: true,
            maxlength: [500, "Notes cannot exceed 500 characters"],
        },

        // ==================== Reference Number ====================
        referenceNumber: {
            type: String,
            unique: true,
            sparse: true,
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
saleSchema.index({ userId: 1, saleDate: -1 });
saleSchema.index({ userId: 1, customer: 1 });
saleSchema.index({ userId: 1, isDeleted: 1 });
saleSchema.index({ userId: 1, paymentStatus: 1 });

// ==================== Virtual Fields ====================
saleSchema.virtual("profit").get(function () {
    return this.totalAmount - this.totalCost;
});

saleSchema.virtual("itemCount").get(function () {
    return this.items ? this.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
});

saleSchema.virtual("balance").get(function () {
    return this.totalAmount - (this.amountPaid || 0);
});

// ==================== Pre-save Middleware ====================
saleSchema.pre("save", function (next) {
    // Generate reference number if not exists
    if (!this.referenceNumber) {
        const date = new Date();
        const timestamp = date.getTime().toString(36).toUpperCase();
        this.referenceNumber = `SAL-${timestamp}`;
    }

    // Calculate total cost from items
    if (this.items && this.items.length > 0) {
        this.totalCost = this.items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
    }

    next();
});

// ==================== Query Middleware ====================
saleSchema.pre(/^find/, function (next) {
    if (!this.getOptions().includeDeleted) {
        this.find({ isDeleted: { $ne: true } });
    }
    next();
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
