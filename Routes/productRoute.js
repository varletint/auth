import express from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProducts,
    testCreate,
    productGet
} from "../controller/productController.js";
import { apiLimiter, createProductLimiter } from "../middleware/rateLimiter.js";
import { verifyToken, verifySeller } from "../middleware/verifyUser.js";

const router = express.Router();

// Apply general API limiter to all product routes
router.use(apiLimiter);

router.post("/", verifyToken, verifySeller, createProductLimiter, createProduct);

router.put("/:id", verifyToken, verifySeller, updateProduct);
router.delete("/:id", verifyToken, verifySeller, deleteProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);

export default router;
