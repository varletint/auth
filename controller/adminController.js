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

        // Get user counts by appType
        const marketplaceUsers = await User.countDocuments({ appType: "marketplace" });
        const businessManagementUsers = await User.countDocuments({ appType: "business_management" });

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
                    // New: App type breakdown
                    marketplace: marketplaceUsers,
                    businessManagement: businessManagementUsers,
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

/**
 * Update user role (add/remove roles)
 */
export const updateUserRole = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role, action } = req.body; // action: 'add' or 'remove'

        if (!role || !action) {
            return res.status(400).json({
                success: false,
                message: "Role and action are required",
            });
        }

        const validRoles = ["admin", "seller", "buyer"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Prevent removing the last admin
        if (role === "admin" && action === "remove") {
            const adminCount = await User.countDocuments({ role: "admin" });
            if (adminCount <= 1 && user.role.includes("admin")) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot remove the last admin",
                });
            }
        }

        if (action === "add") {
            if (!user.role.includes(role)) {
                user.role.push(role);
            }
        } else if (action === "remove") {
            user.role = user.role.filter((r) => r !== role);
            // Ensure user has at least buyer role
            if (user.role.length === 0) {
                user.role = ["buyer"];
            }
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: `Role ${action === "add" ? "added" : "removed"} successfully`,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle user status (active/suspended/banned)
 */
export const toggleUserStatus = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { status } = req.body; // 'active', 'suspended', 'deactivated'

        if (!status || !["active", "suspended", "deactivated"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Valid status is required (active, suspended, deactivated)",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Prevent banning admins
        if (user.role.includes("admin") && status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Cannot suspend or deactivate admin users",
            });
        }

        user.accountStatus = status;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${status === "active" ? "activated" : status}`,
            user: {
                _id: user._id,
                username: user.username,
                accountStatus: user.accountStatus,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Prevent deleting admins
        if (user.role.includes("admin")) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete admin users",
            });
        }

        // Delete user's products
        await Product.deleteMany({ userId: userId });

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "User and their products deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
