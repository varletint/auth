import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        // Buyer who placed the order
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Buyer ID is required"],
        },
        // Seller who owns the product
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Seller ID is required"],
        },
        // Product being ordered
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: [true, "Product ID is required"],
        },
        // Quantity ordered
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [1, "Quantity must be at least 1"],
            default: 1,
        },
        // Total price at time of order (price × quantity)
        totalPrice: {
            type: Number,
            required: [true, "Total price is required"],
            min: [0, "Total price cannot be negative"],
        },
        // Unit price at time of order (for reference)
        unitPrice: {
            type: Number,
            required: [true, "Unit price is required"],
            min: [0, "Unit price cannot be negative"],
        },
        // Order status
        status: {
            type: String,
            enum: {
                values: ["pending", "approved", "declined"],
                message: "{VALUE} is not a valid order status",
            },
            default: "pending",
        },
        // Optional notes from buyer
        buyerNotes: {
            type: String,
            maxlength: [500, "Notes cannot exceed 500 characters"],
        },
        // Optional notes from seller (reason for decline, etc.)
        sellerNotes: {
            type: String,
            maxlength: [500, "Notes cannot exceed 500 characters"],
        },
        // When status was last updated
        statusUpdatedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ==================== Indexes ====================
orderSchema.index({ buyerId: 1, createdAt: -1 }); // Buyer's orders
orderSchema.index({ sellerId: 1, createdAt: -1 }); // Seller's incoming orders
orderSchema.index({ status: 1 }); // Filter by status
orderSchema.index({ productId: 1 }); // Orders for specific product

// ==================== Pre-save Middleware ====================
orderSchema.pre("save", function (next) {
    // Update statusUpdatedAt when status changes
    if (this.isModified("status") && !this.isNew) {
        this.statusUpdatedAt = new Date();
    }
    next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
