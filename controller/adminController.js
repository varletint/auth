import User from "../Models/user.js";
import Product from "../Models/product.js";
import SellerApplication from "../Models/sellerApplication.js";

/**
 * Get admin dashboard statistics
 */
export const getStats = async (req, res, next) => {
    try {
        // Get user counts by role
        const totalUsers = await User.countDocuments();
        const adminCount = await User.countDocuments({ role: "admin" });
        const sellerCount = await User.countDocuments({ role: "seller" });
        const buyerCount = await User.countDocuments({ role: "buyer" });

        // Get product count
        const totalProducts = await Product.countDocuments();

        // Get seller application counts
        const pendingApplications = await SellerApplication.countDocuments({ status: "pending" });
        const approvedApplications = await SellerApplication.countDocuments({ status: "approved" });
        const rejectedApplications = await SellerApplication.countDocuments({ status: "rejected" });

        // Get recent users (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: weekAgo } });

        // Get recent products (last 7 days)
        const newProductsThisWeek = await Product.countDocuments({ createdAt: { $gte: weekAgo } });

        res.status(200).json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    admins: adminCount,
                    sellers: sellerCount,
                    buyers: buyerCount,
                    newThisWeek: newUsersThisWeek,
                },
                products: {
                    total: totalProducts,
                    newThisWeek: newProductsThisWeek,
                },
                sellerApplications: {
                    pending: pendingApplications,
                    approved: approvedApplications,
                    rejected: rejectedApplications,
                    total: pendingApplications + approvedApplications + rejectedApplications,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all users (for admin user management)
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select("-password -resetOTP -resetOTPExpiry")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            users,
            pagination: {
                page,
                limit,
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all products (for admin moderation)
 */
export const getAllProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .populate("userId", "username fullname email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            success: true,
            products,
            pagination: {
                page,
                limit,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};
