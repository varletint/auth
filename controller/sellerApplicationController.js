import SellerApplication from "../Models/sellerApplication.js";
import User from "../Models/user.js";
import { errorHandler } from "../Utilis/errorHandler.js";

/**
 * Apply for seller role
 * POST /api/seller-application/apply
 */
export const applyForSeller = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { reason, businessName } = req.body;

        // Validate reason
        if (!reason || reason.trim() === "") {
            return next(errorHandler(400, "Please provide a reason for applying"));
        }

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // Check if user already has seller role
        if (user.role && user.role.includes("seller")) {
            return next(errorHandler(400, "You are already a seller"));
        }

        // Check if application already exists
        const existingApplication = await SellerApplication.findOne({ userId });
        if (existingApplication) {
            if (existingApplication.status === "pending") {
                return next(errorHandler(400, "You already have a pending application"));
            }
            if (existingApplication.status === "approved") {
                return next(errorHandler(400, "Your application has already been approved"));
            }
            if (existingApplication.status === "rejected") {
                return next(errorHandler(400, "Your application was rejected. Please contact support."));
            }
        }

        // Create application with auto-approved status
        const application = new SellerApplication({
            userId,
            reason: reason.trim(),
            businessName: businessName ? businessName.trim() : undefined,
            status: "approved", // Auto-approve for now
            reviewedAt: new Date(),
        });

        await application.save();

        // Add seller role to user
        if (!user.role) {
            user.role = ["buyer", "seller"];
        } else if (!user.role.includes("seller")) {
            user.role.push("seller");
        }
        await user.save();

        res.status(201).json({
            success: true,
            message: "Congratulations! Your seller application has been approved. You can now create products.",
            application: {
                id: application._id,
                status: application.status,
                reason: application.reason,
                businessName: application.businessName,
                createdAt: application.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get application status
 * GET /api/seller-application/status
 */
export const getApplicationStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Check if user is already a seller
        const user = await User.findById(userId);
        if (user && user.role && user.role.includes("seller")) {
            return res.status(200).json({
                success: true,
                isSeller: true,
                message: "You are already a seller",
            });
        }

        // Get application
        const application = await SellerApplication.findOne({ userId });
        if (!application) {
            return res.status(200).json({
                success: true,
                isSeller: false,
                hasApplication: false,
                message: "No application found",
            });
        }

        res.status(200).json({
            success: true,
            isSeller: false,
            hasApplication: true,
            application: {
                id: application._id,
                status: application.status,
                reason: application.reason,
                businessName: application.businessName,
                createdAt: application.createdAt,
                rejectionReason: application.rejectionReason,
            },
        });
    } catch (error) {
        next(error);
    }
};
