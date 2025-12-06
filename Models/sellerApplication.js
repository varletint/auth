import mongoose from "mongoose";

const sellerApplicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // One application per user
        },
        reason: {
            type: String,
            required: [true, "Please provide a reason for applying"],
            trim: true,
            maxlength: [500, "Reason cannot exceed 500 characters"],
        },
        businessName: {
            type: String,
            trim: true,
            maxlength: [100, "Business name cannot exceed 100 characters"],
        },
        status: {
            type: String,
            enum: {
                values: ["pending", "approved", "rejected"],
                message: "{VALUE} is not a valid status",
            },
            default: "approved", // Auto-approve for now
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        reviewedAt: {
            type: Date,
            default: null,
        },
        rejectionReason: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index for quick lookups
// Note: userId already has an index from unique: true
sellerApplicationSchema.index({ status: 1 });

const SellerApplication = mongoose.model("SellerApplication", sellerApplicationSchema);

export default SellerApplication;
