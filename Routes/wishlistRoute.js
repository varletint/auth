import express from "express";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlistItem,
} from "../controller/wishlistController.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

// All wishlist routes require authentication
router.use(verifyToken);

// GET /api/wishlist - Get user's wishlist
router.get("/", getWishlist);

// POST /api/wishlist/:productId - Add to wishlist
router.post("/:productId", addToWishlist);

// DELETE /api/wishlist/:productId - Remove from wishlist
router.delete("/:productId", removeFromWishlist);

// GET /api/wishlist/check/:productId - Check if in wishlist
router.get("/check/:productId", checkWishlistItem);

export default router;
