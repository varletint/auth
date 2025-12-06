import User from "../Models/user.js";
import UserDetails from "../Models/userDetails.js";
import Product from "../Models/product.js";
import { errorHandler } from "../Utilis/errorHandler.js";
import dayjs from "dayjs";

/**
 * Get user by ID
 * Returns user information without sensitive data (password, OTP, security fields)
 */
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find user and exclude password and other sensitive fields
        const user = await User.findById(id).select("-password -resetOTP -resetOTPExpiry -failedLoginAttempts -accountLockedUntil");

        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // Fetch user details
        const userDetails = await UserDetails.findOne({ user_id: id });

        // Convert to plain object and ensure no sensitive data leaks
        const userObject = user.toObject();

        // Additional safety: explicitly delete any sensitive fields
        delete userObject.password;
        delete userObject.resetOTP;
        delete userObject.resetOTPExpiry;
        delete userObject.failedLoginAttempts;
        delete userObject.accountLockedUntil;
        delete userObject.__v;
        delete userObject.email;
        delete userObject.phone_no;

        // Combine user and userDetails
        const response = {
            ...userObject,
            // Add userDetails if exists
            ...(userDetails && {
                fullName: userDetails.fullName,
                bio: userDetails.bio,
                location: userDetails.location,
                socialMedia: userDetails.socialMedia,
                businessInfo: userDetails.businessInfo
            })
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Get profile stats for the authenticated user
 * Returns: total products, posts remaining this week, days until reset
 */
export const getProfileStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get user for post_count and postResetAt
        const user = await User.findById(userId).select("post_count postResetAt role");
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // Count user's products
        const totalProducts = await Product.countDocuments({ userId: userId });

        // Calculate posts remaining (weekly limit is 7)
        const WEEKLY_POST_LIMIT = 7;
        const postsRemaining = Math.max(0, WEEKLY_POST_LIMIT - (user.post_count || 0));

        // Calculate days until reset
        const now = dayjs();
        const resetDate = dayjs(user.postResetAt);
        let daysUntilReset = resetDate.diff(now, "day");

        // If reset date has passed, calculate the next reset (7 days from now)
        if (daysUntilReset < 0) {
            daysUntilReset = 7;
        }

        // Check if user is a seller
        const isSeller = user.role?.includes("seller");

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                postsRemaining,
                postsUsed: user.post_count || 0,
                weeklyLimit: WEEKLY_POST_LIMIT,
                daysUntilReset,
                resetDate: user.postResetAt,
                isSeller
            }
        });
    } catch (error) {
        next(error);
    }
};
