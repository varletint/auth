import express from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProducts,
    productGet,
    restockProduct,
    getProductTransactionHistory,
    getProductBySlug,  // SEO-friendly product lookup
} from "../controller/productController.js";
import { apiLimiter, createProductLimiter } from "../middleware/rateLimiter.js";
import { verifyToken, verifySeller } from "../middleware/verifyUser.js";

const router = express.Router();

// Apply general API limiter to all product routes
router.use(apiLimiter);

router.post("/", verifyToken, verifySeller, createProductLimiter, createProduct);

router.put("/:id", verifyToken, verifySeller, updateProduct);
router.delete("/:id", verifyToken, verifySeller, deleteProduct);

// Restock and transaction history routes (seller only)
router.patch("/:id/restock", verifyToken, verifySeller, restockProduct);
router.get("/:id/transactions", verifyToken, verifySeller, getProductTransactionHistory);

// SEO-friendly route: Get product by seller username + product slug
// Example: /api/products/slug/techstore/iphone-15-pro
router.get("/slug/:sellerUsername/:productSlug", getProductBySlug);

// ID-based route (supports smart redirect with ?redirect=true)
router.get("/:id", getProduct);
router.get("/", getProducts);

export default router;
