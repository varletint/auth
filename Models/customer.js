import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        // ==================== User Reference (Business Owner) ====================
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },

        // ==================== Customer Details ====================
        name: {
            type: String,
            required: [true, "Customer name is required"],
            trim: true,
            maxlength: [100, "Customer name cannot exceed 100 characters"],
        },

        phone: {
            type: String,
            trim: true,
            maxlength: [20, "Phone number cannot exceed 20 characters"],
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            maxlength: [100, "Email cannot exceed 100 characters"],
        },

        address: {
            type: String,
            trim: true,
            maxlength: [300, "Address cannot exceed 300 characters"],
        },

        // ==================== Customer Stats ====================
        totalPurchases: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalSpent: {
            type: Number,
            default: 0,
            min: 0,
        },

        lastPurchaseDate: {
            type: Date,
            default: null,
        },

        // ==================== Notes ====================
        notes: {
            type: String,
            trim: true,
            maxlength: [500, "Notes cannot exceed 500 characters"],
        },

        // ==================== Status ====================
        isActive: {
            type: Boolean,
            default: true,
        },

        // ==================== Soft Delete ====================
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ==================== Indexes ====================
customerSchema.index({ userId: 1, name: 1 });
customerSchema.index({ userId: 1, phone: 1 });
customerSchema.index({ userId: 1, isDeleted: 1 });

// ==================== Virtuals ====================
customerSchema.virtual('customersHistory', {
    ref: 'Sale',           // Look in the Sale collection
    localField: '_id',     // Match Customer._id
    foreignField: 'customer', // With Sale.customer
    justOne: false,       // Return all matching sales (array)
    count: true,
    options: { populate: 'customer', limit: 10 },
    match: { isDeleted: false },
});

// ==================== Query Middleware ====================
customerSchema.pre(/^find/, function (next) {
    if (!this.getOptions().includeDeleted) {
        this.find({ isDeleted: { $ne: true } });
    }
    next();
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
