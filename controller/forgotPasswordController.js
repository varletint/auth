import U from "../Models/user.js";
import { errorHandler } from "../Utilis/errorHandler.js";
import { sendOTPEmail, generateOTP } from "../Utilis/emailService.js";
import bcryptjs from "bcryptjs";

// Request OTP for password reset
export const requestOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return next(errorHandler(400, "Email is required"));
        }

        // Find user by email
        const user = await U.findOne({ email: email.trim() });
        if (!user) {
            return next(errorHandler(404, "No account found with this email address"));
        }

        // Generate OTP and set expiry (4 minutes)
        const otp = generateOTP();
        const expiryTime = new Date(Date.now() + 4 * 60 * 1000); // 4 minutes from now

        // Save OTP to user
        user.resetOTP = otp;
        user.resetOTPExpiry = expiryTime;
        await user.save();

        // Send OTP via email
        try {
            await sendOTPEmail(email, otp, user.username || user.fullname);
            res.status(200).json({
                success: true,
                message: "OTP sent to your email. Please check your inbox.",
            });
        } catch (emailError) {
            // Clear OTP if email fails
            user.resetOTP = null;
            user.resetOTPExpiry = null;
            await user.save();
            return next(errorHandler(500, emailError.message));
        }
    } catch (error) {
        next(error);
    }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return next(errorHandler(400, "Email and OTP are required"));
        }

        // Find user
        const user = await U.findOne({ email: email.trim() });
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // Check if OTP exists
        if (!user.resetOTP) {
            return next(errorHandler(400, "No OTP requested. Please request a new OTP."));
        }

        // Check if OTP expired
        if (new Date() > user.resetOTPExpiry) {
            user.resetOTP = null;
            user.resetOTPExpiry = null;
            await user.save();
            return next(errorHandler(400, "OTP has expired. Please request a new one."));
        }

        // Verify OTP
        if (user.resetOTP !== otp.trim()) {
            return next(errorHandler(400, "Invalid OTP. Please check and try again."));
        }

        // OTP is valid
        res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can now reset your password.",
        });
    } catch (error) {
        next(error);
    }
};

// Reset password
export const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return next(errorHandler(400, "Email, OTP, and new password are required"));
        }

        if (newPassword.length < 6) {
            return next(errorHandler(400, "Password must be at least 6 characters long"));
        }

        // Find user
        const user = await U.findOne({ email: email.trim() });
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // Verify OTP again
        if (!user.resetOTP || user.resetOTP !== otp.trim()) {
            return next(errorHandler(400, "Invalid OTP"));
        }

        // Check if OTP expired
        if (new Date() > user.resetOTPExpiry) {
            user.resetOTP = null;
            user.resetOTPExpiry = null;
            await user.save();
            return next(errorHandler(400, "OTP has expired. Please request a new one."));
        }

        // Hash new password
        const hashedPassword = bcryptjs.hashSync(newPassword, 10);

        // Update password and clear OTP
        user.password = hashedPassword;
        user.resetOTP = null;
        user.resetOTPExpiry = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now login with your new password.",
        });
    } catch (error) {
        next(error);
    }
};
