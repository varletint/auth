import Order from "../Models/order.js";
import Product from "../Models/product.js";
import User from "../Models/user.js";
import { errorHandler } from "../Utilis/errorHandler.js";

/**
 * Create a new order
 * POST /api/orders/:productId
 */
export const createOrder = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity = 1, buyerNotes } = req.body;
        const buyerId = req.user.id;

        // Validate quantity
        if (quantity < 1) {
            return next(errorHandler(400, "Quantity must be at least 1"));
        }

        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        // Check if buyer is not the seller (can't buy own products)
        if (product.userId.toString() === buyerId) {
            return next(errorHandler(400, "You cannot order your own product"));
        }

        // Check stock availability
        if (product.trackInventory && product.stock < quantity) {
            return next(errorHandler(400, `Only ${product.stock} items available in stock`));
        }

        // Calculate prices
        const unitPrice = product.salePrice || product.price;
        const totalPrice = unitPrice * quantity;

        // Create order
        const order = new Order({
            buyerId,
            sellerId: product.userId,
            productId,
            quantity,
            unitPrice,
            totalPrice,
            buyerNotes,
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: {
                id: order._id,
                status: order.status,
                quantity: order.quantity,
                totalPrice: order.totalPrice,
                createdAt: order.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get buyer's orders (My Orders)
 * GET /api/orders/my-orders
 */
export const getBuyerOrders = async (req, res, next) => {
    try {
        const buyerId = req.user.id;
        const { status, page = 1, limit = 10 } = req.query;

        // Build query
        const query = { buyerId };
        if (status && ["pending", "approved", "declined"].includes(status)) {
            query.status = status;
        }

        // Get total count
        const total = await Order.countDocuments(query);

        // Get orders with pagination
        const orders = await Order.find(query)
            .populate({
                path: "productId",
                select: "name price images slug",
            })
            .populate({
                path: "sellerId",
                select: "username",
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Transform orders
        const transformedOrders = orders.map((order) => ({
            id: order._id,
            product: order.productId
                ? {
                    id: order.productId._id,
                    name: order.productId.name,
                    image: order.productId.images?.[0] || null,
                    slug: order.productId.slug,
                }
                : null,
            seller: order.sellerId
                ? {
                    id: order.sellerId._id,
                    username: order.sellerId.username,
                }
                : null,
            quantity: order.quantity,
            unitPrice: order.unitPrice,
            totalPrice: order.totalPrice,
            status: order.status,
            buyerNotes: order.buyerNotes,
            sellerNotes: order.sellerNotes,
            createdAt: order.createdAt,
            statusUpdatedAt: order.statusUpdatedAt,
        }));

        res.status(200).json({
            success: true,
            count: transformedOrders.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            orders: transformedOrders,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get seller's incoming orders
 * GET /api/orders/seller-orders
 */
export const getSellerOrders = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        const { status, page = 1, limit = 10 } = req.query;

        // Verify user is a seller
        const user = await User.findById(sellerId);
        if (!user || !user.role.includes("seller")) {
            return next(errorHandler(403, "Only sellers can access this endpoint"));
        }

        // Build query
        const query = { sellerId };
        if (status && ["pending", "approved", "declined"].includes(status)) {
            query.status = status;
        }

        // Get total count
        const total = await Order.countDocuments(query);

        // Get orders with pagination
        const orders = await Order.find(query)
            .populate({
                path: "productId",
                select: "name price images slug",
            })
            .populate({
                path: "buyerId",
                select: "username email phone_no",
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Transform orders
        const transformedOrders = orders.map((order) => ({
            id: order._id,
            product: order.productId
                ? {
                    id: order.productId._id,
                    name: order.productId.name,
                    image: order.productId.images?.[0] || null,
                    slug: order.productId.slug,
                }
                : null,
            buyer: order.buyerId
                ? {
                    id: order.buyerId._id,
                    username: order.buyerId.username,
                    email: order.buyerId.email,
                    phone: order.buyerId.phone_no,
                }
                : null,
            quantity: order.quantity,
            unitPrice: order.unitPrice,
            totalPrice: order.totalPrice,
            status: order.status,
            buyerNotes: order.buyerNotes,
            sellerNotes: order.sellerNotes,
            createdAt: order.createdAt,
            statusUpdatedAt: order.statusUpdatedAt,
        }));

        res.status(200).json({
            success: true,
            count: transformedOrders.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            orders: transformedOrders,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update order status (Seller only)
 * PATCH /api/orders/:orderId/status
 */
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status, sellerNotes } = req.body;
        const sellerId = req.user.id;

        // Validate status
        if (!status || !["approved", "declined"].includes(status)) {
            return next(errorHandler(400, "Status must be 'approved' or 'declined'"));
        }

        // Find order
        const order = await Order.findById(orderId);
        if (!order) {
            return next(errorHandler(404, "Order not found"));
        }

        // Verify seller owns this order
        if (order.sellerId.toString() !== sellerId) {
            return next(errorHandler(403, "You can only update orders for your products"));
        }

        // Check if order can still be updated
        if (order.status !== "pending") {
            return next(errorHandler(400, `Order has already been ${order.status}`));
        }

        // Update order
        order.status = status;
        if (sellerNotes) {
            order.sellerNotes = sellerNotes;
        }
        order.statusUpdatedAt = new Date();

        await order.save();

        res.status(200).json({
            success: true,
            message: `Order ${status} successfully`,
            order: {
                id: order._id,
                status: order.status,
                sellerNotes: order.sellerNotes,
                statusUpdatedAt: order.statusUpdatedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single order details
 * GET /api/orders/:orderId
 */
export const getOrderById = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findById(orderId)
            .populate({
                path: "productId",
                select: "name price images slug description",
            })
            .populate({
                path: "buyerId",
                select: "username email phone_no",
            })
            .populate({
                path: "sellerId",
                select: "username",
            });

        if (!order) {
            return next(errorHandler(404, "Order not found"));
        }

        // Verify user is either buyer or seller
        if (order.buyerId._id.toString() !== userId && order.sellerId._id.toString() !== userId) {
            return next(errorHandler(403, "You don't have access to this order"));
        }

        res.status(200).json({
            success: true,
            order: {
                id: order._id,
                product: order.productId
                    ? {
                        id: order.productId._id,
                        name: order.productId.name,
                        image: order.productId.images?.[0] || null,
                        slug: order.productId.slug,
                        description: order.productId.description,
                    }
                    : null,
                buyer: order.buyerId
                    ? {
                        id: order.buyerId._id,
                        username: order.buyerId.username,
                        email: order.buyerId.email,
                        phone: order.buyerId.phone_no,
                    }
                    : null,
                seller: order.sellerId
                    ? {
                        id: order.sellerId._id,
                        username: order.sellerId.username,
                    }
                    : null,
                quantity: order.quantity,
                unitPrice: order.unitPrice,
                totalPrice: order.totalPrice,
                status: order.status,
                buyerNotes: order.buyerNotes,
                sellerNotes: order.sellerNotes,
                createdAt: order.createdAt,
                statusUpdatedAt: order.statusUpdatedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};
