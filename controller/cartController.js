import Cart from "../Models/cart.js";
import Product from "../Models/product.js";
import { errorHandler } from "../Utilis/errorHandler.js";

/**
 * Get all cart items for the authenticated user
 */
export const getCart = async (req, res, next) => {
    try {
        const cartItems = await Cart.find({ userId: req.user.id })
            .populate({
                path: "productId",
                select: "name price images stock stockStatus slug",
            })
            .sort({ addedAt: -1 });

        // Transform to include product data directly and filter out null products
        const items = cartItems
            .filter((item) => item.productId !== null)
            .map((item) => ({
                id: item._id,
                productId: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                image: item.productId.images?.[0] || null,
                inStock: item.productId.stock > 0,
                stock: item.productId.stock,
                slug: item.productId.slug,
                quantity: item.quantity,
                addedAt: item.addedAt,
            }));

        // Calculate totals
        const subtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        res.status(200).json({
            success: true,
            count: items.length,
            items,
            subtotal,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add product to cart or increment quantity if exists
 */
export const addToCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity = 1 } = req.body;

        // Validate quantity
        if (quantity < 1) {
            return next(errorHandler(400, "Quantity must be at least 1"));
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        // Check if already in cart
        const existing = await Cart.findOne({
            userId: req.user.id,
            productId,
        });

        if (existing) {
            // Increment quantity
            existing.quantity += quantity;
            await existing.save();

            return res.status(200).json({
                success: true,
                message: "Cart updated",
                item: {
                    id: existing._id,
                    productId: product._id,
                    name: product.name,
                    quantity: existing.quantity,
                },
            });
        }

        // Add new cart item
        const cartItem = new Cart({
            userId: req.user.id,
            productId,
            quantity,
        });

        await cartItem.save();

        res.status(201).json({
            success: true,
            message: "Product added to cart",
            item: {
                id: cartItem._id,
                productId: product._id,
                name: product.name,
                quantity: cartItem.quantity,
                addedAt: cartItem.addedAt,
            },
        });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            // Race condition - item was added between check and insert
            // Just update the quantity instead
            try {
                const { productId } = req.params;
                const { quantity = 1 } = req.body;
                const existing = await Cart.findOneAndUpdate(
                    { userId: req.user.id, productId },
                    { $inc: { quantity } },
                    { new: true }
                );
                return res.status(200).json({
                    success: true,
                    message: "Cart updated",
                    item: {
                        id: existing._id,
                        quantity: existing.quantity,
                    },
                });
            } catch (updateError) {
                next(updateError);
            }
        }
        next(error);
    }
};

/**
 * Update cart item quantity
 */
export const updateQuantity = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        // Validate quantity
        if (typeof quantity !== "number" || quantity < 1) {
            return next(errorHandler(400, "Quantity must be at least 1"));
        }

        const cartItem = await Cart.findOneAndUpdate(
            { userId: req.user.id, productId },
            { quantity },
            { new: true }
        );

        if (!cartItem) {
            return next(errorHandler(404, "Item not found in cart"));
        }

        res.status(200).json({
            success: true,
            message: "Quantity updated",
            item: {
                id: cartItem._id,
                quantity: cartItem.quantity,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove product from cart
 */
export const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const result = await Cart.findOneAndDelete({
            userId: req.user.id,
            productId,
        });

        if (!result) {
            return next(errorHandler(404, "Item not found in cart"));
        }

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Clear entire cart
 */
export const clearCart = async (req, res, next) => {
    try {
        await Cart.deleteMany({ userId: req.user.id });

        res.status(200).json({
            success: true,
            message: "Cart cleared",
        });
    } catch (error) {
        next(error);
    }
};
