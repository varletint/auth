import mongoose from "mongoose";
import dayjs from "dayjs";

const userSchema = new mongoose.Schema(
  {
    // ==================== Authentication Fields ====================
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address"
      ],
    },

    phone_no: {
      type: String, // Changed from Number to String for better handling
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^[0-9]{10,11}$/, "Phone number must be 10-11 digits"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default in queries
    },

    // ==================== User Roles & Permissions ====================
    role: {
      type: [String], // Array of roles
      enum: {
        values: ["admin", "seller", "buyer"],
        message: "{VALUE} is not a valid role"
      },
      default: ["buyer"],
    },

    // ==================== App Type Selection ====================
    appType: {
      type: String,
      enum: {
        values: ["marketplace", "business_management"],
        message: "{VALUE} is not a valid app type"
      },
      default: "marketplace",
    },

    // ==================== Account Status & Security ====================
    accountStatus: {
      type: String,
      enum: {
        values: ["active", "suspended", "deactivated", "pending"],
        message: "{VALUE} is not a valid account status"
      },
      default: "active",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },

    emailVerificationExpiry: {
      type: Date,
      default: null,
      select: false,
    },

    // ==================== Password Reset ====================
    resetOTP: {
      type: String,
      default: null,
      select: false,
    },

    resetOTPExpiry: {
      type: Date,
      default: null,
      select: false,
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

    lastLogin: {
      type: Date,
      default: null,
    },

    lastPasswordChange: {
      type: Date,
      default: Date.now,
    },

    // ==================== User Activity ====================
    post_count: {
      type: Number,
      default: 0,
      min: [0, "Post count cannot be negative"],
    },

    postResetAt: {
      type: Date,
      default: () => dayjs().add(7, "days").startOf("day").toDate(),
    },

    // ==================== Profile Completion ====================
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // ==================== Soft Delete ====================
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },

    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ==================== Indexes for Performance ====================
// Note: username, email, phone_no already have unique indexes from schema definition
// Only compound indexes and non-unique field indexes are defined here
userSchema.index({ accountStatus: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ isDeleted: 1, accountStatus: 1 }); // Compound index for queries

// ==================== Virtual Fields ====================
userSchema.virtual("isAccountLocked").get(function () {
  return this.accountLockedUntil && this.accountLockedUntil > Date.now();
});

userSchema.virtual("isAdmin").get(function () {
  return this.role && this.role.includes("admin");
});

userSchema.virtual("isSeller").get(function () {
  return this.role && this.role.includes("seller");
});

userSchema.virtual("isBuyer").get(function () {
  return this.role && this.role.includes("buyer");
});

// ==================== Instance Methods ====================
userSchema.methods.incrementFailedLogins = function () {
  this.failedLoginAttempts += 1;

  // Lock account after 5 failed attempts for 1 hour
  if (this.failedLoginAttempts >= 5) {
    this.accountLockedUntil = dayjs().add(1, "hour").toDate();
  }

  return this.save();
};

userSchema.methods.resetFailedLogins = function () {
  this.failedLoginAttempts = 0;
  this.accountLockedUntil = null;
  return this.save();
};

userSchema.methods.hasRole = function (role) {
  return this.role && this.role.includes(role);
};

userSchema.methods.isOTPValid = function () {
  // Check if OTP exists and hasn't expired
  if (!this.resetOTP || !this.resetOTPExpiry) {
    return false;
  }

  // Check if current time is before expiry time
  return Date.now() < this.resetOTPExpiry.getTime();
};

userSchema.methods.clearOTP = function () {
  this.resetOTP = null;
  this.resetOTPExpiry = null;
  return this.save();
};


// ==================== Pre-save Middleware ====================
userSchema.pre("save", function (next) {
  // Ensure phone number doesn't have spaces or special characters
  if (this.isModified("phone_no")) {
    this.phone_no = this.phone_no.replace(/\D/g, "");
  }
  next();
});

// ==================== Query Middleware ====================
// Exclude deleted users by default
userSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
