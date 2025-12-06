import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema(
    {
        // ==================== User Reference ====================
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            unique: true, // This automatically creates an index
        },

        // ==================== Personal Information ====================
        fullName: {
            type: String,
            trim: true,
            maxlength: [100, "Full name cannot exceed 100 characters"],
        },

        displayName: {
            type: String,
            trim: true,
            maxlength: [50, "Display name cannot exceed 50 characters"],
        },

        bio: {
            type: String,
            trim: true,
            maxlength: [500, "Bio cannot exceed 500 characters"],
        },

        dateOfBirth: {
            type: Date,
            validate: {
                validator: function (value) {
                    // User must be at least 13 years old
                    const minAge = new Date();
                    minAge.setFullYear(minAge.getFullYear() - 13);
                    return value <= minAge;
                },
                message: "User must be at least 13 years old",
            },
        },

        gender: {
            type: String,
            enum: {
                values: ["male", "female", "other", "prefer_not_to_say"],
                message: "{VALUE} is not a valid gender option",
            },
        },

        // ==================== Profile Media ====================
        avatar: {
            url: {
                type: String,
                match: [
                    /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                    "Please provide a valid image URL",
                ],
            },
            publicId: {
                type: String, // For Cloudinary or similar services
            },
            uploadedAt: {
                type: Date,
                default: Date.now,
            },
        },

        coverImage: {
            url: {
                type: String,
                match: [
                    /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                    "Please provide a valid image URL",
                ],
            },
            publicId: {
                type: String,
            },
        },

        // ==================== Location Information ====================
        location: {
            country: {
                name: {
                    type: String,
                    trim: true,
                },
                code: {
                    type: String,
                    uppercase: true,
                    minlength: 2,
                    maxlength: 3, // ISO country codes
                },
            },
            state: {
                type: String,
                trim: true,
            },
            city: {
                type: String,
                trim: true,
            },
            address: {
                type: String,
                trim: true,
                maxlength: [200, "Address cannot exceed 200 characters"],
            },
            zipCode: {
                type: String,
                trim: true,
            },
            coordinates: {
                latitude: {
                    type: Number,
                    min: -90,
                    max: 90,
                },
                longitude: {
                    type: Number,
                    min: -180,
                    max: 180,
                },
            },
        },

        // ==================== Contact Information ====================
        alternateEmail: {
            type: String,
            trim: true,
            lowercase: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please provide a valid email address",
            ],
        },

        alternatePhone: {
            type: String,
            trim: true,
            match: [/^[0-9]{10,11}$/, "Phone number must be 10-11 digits"],
        },

        // ==================== Social Media ====================
        socialMedia: {
            website: {
                type: String,
                match: [/^https?:\/\/.+/, "Please provide a valid URL"],
            },
            twitter: {
                type: String,
                trim: true,
            },
            facebook: {
                type: String,
                trim: true,
            },
            instagram: {
                type: String,
                trim: true,
            },
            linkedin: {
                type: String,
                trim: true,
            },
        },

        // ==================== Business Information (for sellers) ====================
        businessInfo: {
            businessName: {
                type: String,
                trim: true,
                maxlength: [100, "Business name cannot exceed 100 characters"],
            },
            businessType: {
                type: String,
                enum: ["individual", "company", "partnership", "other"],
            },
            taxId: {
                type: String,
                trim: true,
                select: false, // Sensitive information
            },
            businessAddress: {
                type: String,
                trim: true,
            },
            businessPhone: {
                type: String,
                trim: true,
            },
            businessEmail: {
                type: String,
                trim: true,
                lowercase: true,
            },
        },

        // ==================== Preferences & Settings ====================
        preferences: {
            language: {
                type: String,
                default: "en",
                lowercase: true,
            },
            timezone: {
                type: String,
                default: "UTC",
            },
            currency: {
                type: String,
                uppercase: true,
                default: "USD",
                minlength: 3,
                maxlength: 3,
            },
            notifications: {
                email: {
                    type: Boolean,
                    default: true,
                },
                sms: {
                    type: Boolean,
                    default: false,
                },
                push: {
                    type: Boolean,
                    default: true,
                },
            },
        },

        // ==================== Privacy Settings ====================
        privacy: {
            showEmail: {
                type: Boolean,
                default: false,
            },
            showPhone: {
                type: Boolean,
                default: false,
            },
            showLocation: {
                type: Boolean,
                default: true,
            },
            profileVisibility: {
                type: String,
                enum: ["public", "private", "friends"],
                default: "public",
            },
        },

        // ==================== Statistics ====================
        stats: {
            totalPurchases: {
                type: Number,
                default: 0,
                min: 0,
            },
            totalSales: {
                type: Number,
                default: 0,
                min: 0,
            },
            followers: {
                type: Number,
                default: 0,
                min: 0,
            },
            following: {
                type: Number,
                default: 0,
                min: 0,
            },
        },

        // ==================== Verification ====================
        verification: {
            isVerified: {
                type: Boolean,
                default: false,
            },
            verifiedAt: {
                type: Date,
            },
            verificationDocuments: [
                {
                    type: {
                        type: String,
                        enum: ["id_card", "passport", "drivers_license", "business_license"],
                    },
                    url: String,
                    status: {
                        type: String,
                        enum: ["pending", "approved", "rejected"],
                        default: "pending",
                    },
                    uploadedAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
        },

        // ==================== Additional Information ====================
        interests: [
            {
                type: String,
                trim: true,
            },
        ],

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        lastProfileUpdate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ==================== Indexes for Performance ====================
// userDetailsSchema.index({ user_id: 1 }, { unique: true });
userDetailsSchema.index({ "location.country.code": 1 });
userDetailsSchema.index({ "location.city": 1 });
userDetailsSchema.index({ "businessInfo.businessName": 1 });
userDetailsSchema.index({ fullName: "text", bio: "text" }); // Text search
userDetailsSchema.index({ createdAt: -1 });

// ==================== Virtual Fields ====================
userDetailsSchema.virtual("age").get(function () {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

userDetailsSchema.virtual("hasCompletedProfile").get(function () {
    return !!(
        this.fullName &&
        this.bio &&
        this.avatar?.url &&
        this.location?.country?.name
    );
});

userDetailsSchema.virtual("isBusinessVerified").get(function () {
    return this.verification?.isVerified && this.businessInfo?.businessName;
});

// ==================== Instance Methods ====================
userDetailsSchema.methods.updateLastProfileUpdate = function () {
    this.lastProfileUpdate = Date.now();
    return this.save();
};

// ==================== Pre-save Middleware ====================
userDetailsSchema.pre("save", function (next) {
    // Update lastProfileUpdate timestamp on every save
    this.lastProfileUpdate = Date.now();
    next();
});

// ==================== Populate User on Find ====================
userDetailsSchema.pre(/^find/, function (next) {
    if (!this.getOptions().skipPopulate) {
        this.populate({
            path: "user_id",
            select: "username email phone_no role accountStatus createdAt",
        });
    }
    next();
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

export default UserDetails;