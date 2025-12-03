import U from "../Models/user.js";
import { errorHandler } from "../Utilis/errorHandler.js";
import { sendOTPEmail, generateOTP } from "../Utilis/emailService.js";
import argon2 from "argon2";

// Request OTP for password reset
export const requestOTP = async (req, res, next) => {
    try {
        console.log("=== REQUEST OTP STARTED ===");
        console.log("Request body:", req.body);

        const { email } = req.body;

        if (!email || !email.trim()) {
            console.log("ERROR: Email is missing");
            return next(errorHandler(400, "Email is required"));
        }

        // Find user by email
        const user = await U.findOne({ email: email.trim() });
        if (!user) {
            console.log("ERROR: User not found for email:", email);
            return next(errorHandler(404, "No account found with this email address"));
        }

        console.log("User found:", user.username || user.email);

        // Generate OTP and set expiry (4 minutes)
        const otp = generateOTP();
        console.log("Generated OTP:", otp); // Temporary log for testing
        const expiryTime = new Date(Date.now() + 4 * 60 * 1000); // 4 minutes from now

        // Save OTP to user
        user.resetOTP = otp;
        user.resetOTPExpiry = expiryTime;
        await user.save();
        console.log("OTP saved to database");

        // Send OTP via email
        try {
            console.log("Attempting to send email to:", email);
            console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "NOT SET");
            console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "NOT SET");

            await sendOTPEmail(email, otp, user.username || user.fullname);
            console.log("Email sent successfully");

            res.status(200).json({
                success: true,
                message: "OTP sent to your email. Please check your inbox.",
            });
            console.log("=== REQUEST OTP COMPLETED ===");
        } catch (emailError) {
            console.error("EMAIL ERROR:", emailError);
            console.error("Email error message:", emailError.message);
            console.error("Email error stack:", emailError.stack);

            // Clear OTP if email fails
            user.resetOTP = null;
            user.resetOTPExpiry = null;
            await user.save();

            // Return a specific error message
            return next(errorHandler(500, `Failed to send email: ${emailError.message}`));
        }
    } catch (error) {
        console.error("CONTROLLER ERROR:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
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
        const user = await U.findOne({ email: email.trim() }).select('+resetOTP +resetOTPExpiry')
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
        const user = await U.findOne({ email: email.trim() }).select('+resetOTP +resetOTPExpiry');
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
        const hashedPassword = await argon2.hash(newPassword);

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
