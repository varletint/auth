import User from "../Models/user.js";
import UserDetails from "../Models/userDetails.js";
import { errorHandler } from "../Utilis/errorHandler.js";

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
