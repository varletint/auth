import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
    {
        // ==================== Business Owner Reference ====================
        businessOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Business owner is required"],
            index: true,
        },

        // ==================== Staff Authentication ====================
        staff_name: {
            type: String,
            required: [true, "Staff name is required"],
            trim: true,
            lowercase: true,
            minlength: [2, "Staff name must be at least 2 characters"],
            maxlength: [50, "Staff name cannot exceed 50 characters"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },

        // ==================== Role & Permissions ====================
        role: {
            type: String,
            enum: {
                values: ["manager", "cashier", "inventory_clerk"],
                message: "{VALUE} is not a valid staff role",
            },
            default: "cashier",
        },

        permissions: {
            type: [String],
            enum: [
                "view_sales",
                "create_sale",
                "view_inventory",
                "manage_inventory",
                "view_customers",
                "manage_customers",
                "view_expenses",
                "manage_expenses",
                "view_staff",
                "manage_staff",
                "view_reports",
            ],
            default: [],
        },

        // ==================== Status ====================
        isActive: {
            type: Boolean,
            default: true,
        },

        lastLogin: {
            type: Date,
            default: null,
        },

        // ==================== Login Security ====================
        failedLoginAttempts: {
            type: Number,
            default: 0,
        },

        accountLockedUntil: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ==================== Indexes ====================
// Compound unique index: staff_name is unique per business
staffSchema.index({ businessOwner: 1, staff_name: 1 }, { unique: true });
staffSchema.index({ isActive: 1 });

// ==================== Virtual Fields ====================
staffSchema.virtual("isAccountLocked").get(function () {
    return this.accountLockedUntil && this.accountLockedUntil > Date.now();
});

// ==================== Static Methods ====================
// Get default permissions by role
staffSchema.statics.getDefaultPermissions = function (role) {
    const permissionsByRole = {
        manager: [
            "view_sales",
            "create_sale",
            "view_inventory",
            "manage_inventory",
            "view_customers",
            "manage_customers",
            "view_expenses",
            "manage_expenses",
            "view_staff",
            "manage_staff",
            "view_reports",
        ],
        cashier: [
            "view_sales",
            "create_sale",
            "view_inventory",
            "view_customers",
        ],
        inventory_clerk: [
            "view_inventory",
            "manage_inventory",
            "view_reports",
        ],
    };

    return permissionsByRole[role] || [];
};

// ==================== Instance Methods ====================
staffSchema.methods.incrementFailedLogins = async function () {
    this.failedLoginAttempts += 1;

    // Lock account after 5 failed attempts for 30 minutes
    if (this.failedLoginAttempts >= 5) {
        this.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    return this.save();
};

staffSchema.methods.resetFailedLogins = async function () {
    this.failedLoginAttempts = 0;
    this.accountLockedUntil = null;
    return this.save();
};

staffSchema.methods.hasPermission = function (permission) {
    return this.permissions.includes(permission);
};

// ==================== Pre-save Middleware ====================
staffSchema.pre("save", function (next) {
    // Set default permissions based on role if permissions array is empty
    if (this.isNew && this.permissions.length === 0) {
        this.permissions = this.constructor.getDefaultPermissions(this.role);
    }
    next();
});

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
