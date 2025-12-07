import express from "express";
import {
    createOrder,
    createBulkOrders,
    getBuyerOrders,
    getSellerOrders,
    updateOrderStatus,
    getOrderById,
} from "../controller/orderController.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

// All order routes require authentication
router.use(verifyToken);

// POST /api/orders/bulk - Create bulk orders from cart
router.post("/bulk", createBulkOrders);

// POST /api/orders/:productId - Create new order
router.post("/:productId", createOrder);

// GET /api/orders/my-orders - Get buyer's orders
router.get("/my-orders", getBuyerOrders);

// GET /api/orders/seller-orders - Get seller's incoming orders
router.get("/seller-orders", getSellerOrders);

// GET /api/orders/:orderId - Get single order details
router.get("/:orderId", getOrderById);

// PATCH /api/orders/:orderId/status - Update order status (seller only)
router.patch("/:orderId/status", updateOrderStatus);

export default router;
