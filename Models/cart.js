import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: [true, "Product ID is required"],
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
            default: 1,
        },
        addedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index to prevent duplicate cart entries for same product
cartSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
