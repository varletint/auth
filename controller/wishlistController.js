import Wishlist from "../Models/wishlist.js";
import Product from "../Models/product.js";
import { errorHandler } from "../Utilis/errorHandler.js";

/**
 * Get all wishlist items for the authenticated user
 */
export const getWishlist = async (req, res, next) => {
    try {
        const wishlistItems = await Wishlist.find({ userId: req.user.id })
            .populate({
                path: "productId",
                select: "name price images stock stockStatus slug",
            })
            .sort({ addedAt: -1 });

        // Transform to include product data directly and filter out null products
        const items = wishlistItems
            .filter((item) => item.productId !== null)
            .map((item) => ({
                id: item._id,
                productId: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                image: item.productId.images?.[0] || null,
                inStock: item.productId.stock > 0,
                slug: item.productId.slug,
                addedAt: item.addedAt,
            }));

        res.status(200).json({
            success: true,
            count: items.length,
            items,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add product to wishlist
 */
export const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        // Check if already in wishlist
        const existing = await Wishlist.findOne({
            userId: req.user.id,
            productId,
        });

        if (existing) {
            return res.status(200).json({
                success: true,
                message: "Product already in wishlist",
                alreadyExists: true,
            });
        }

        // Add to wishlist
        const wishlistItem = new Wishlist({
            userId: req.user.id,
            productId,
        });

        await wishlistItem.save();

        res.status(201).json({
            success: true,
            message: "Product added to wishlist",
            item: {
                id: wishlistItem._id,
                productId: product._id,
                name: product.name,
                addedAt: wishlistItem.addedAt,
            },
        });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(200).json({
                success: true,
                message: "Product already in wishlist",
                alreadyExists: true,
            });
        }
        next(error);
    }
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const result = await Wishlist.findOneAndDelete({
            userId: req.user.id,
            productId,
        });

        if (!result) {
            return next(errorHandler(404, "Item not found in wishlist"));
        }

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Check if a product is in user's wishlist
 */
export const checkWishlistItem = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const item = await Wishlist.findOne({
            userId: req.user.id,
            productId,
        });

        res.status(200).json({
            success: true,
            inWishlist: !!item,
        });
    } catch (error) {
        next(error);
    }
};
