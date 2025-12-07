import express from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProducts,
    productGet,
    restockProduct,
    getProductTransactionHistory
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

router.get("/:id", getProduct);
router.get("/", getProducts);

export default router;
