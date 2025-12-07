import express from "express";
import {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
} from "../controller/cartController.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

// All cart routes require authentication
router.use(verifyToken);

// GET /api/cart - Get user's cart
router.get("/", getCart);

// POST /api/cart/:productId - Add to cart
router.post("/:productId", addToCart);

// PATCH /api/cart/:productId - Update quantity
router.patch("/:productId", updateQuantity);

// DELETE /api/cart/:productId - Remove from cart
router.delete("/:productId", removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete("/", clearCart);

export default router;
