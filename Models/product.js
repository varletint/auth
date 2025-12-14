import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // ============================================
    // BASIC INFORMATION
    // ============================================
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    description: {
      type: String,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      uppercase: true,
    },

    // ============================================
    // SKU & IDENTIFICATION
    // ============================================
    sku: {
      type: String,
      // required: true,
      unique: true,
      sparse: true,
      uppercase: true,
    },

    // Fields for SKU generation
    color: {
      type: String,
      trim: true,
      uppercase: true,
    },

    subcategory: {
      type: String,
      trim: true,
      lowercase: true,
    },

    model: {
      type: String,
      trim: true,
    },

    // ============================================
    // PRICING (direct amount in NGN)
    // ============================================
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    currency: {
      type: String,
      default: "NGN",
      enum: ["NGN", "USD", "EUR", "GBP"],
      uppercase: true,
    },

    salePrice: {
      type: Number,
      min: [0, "Sale price cannot be negative"],
    },

    costPrice: {
      type: Number,
      min: [0, "Cost price cannot be negative"],
    },

    compareAtPrice: {
      type: Number,
      min: [0, "Compare at price cannot be negative"],
    },

    // ============================================
    // INVENTORY MANAGEMENT
    // ============================================
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be an integer",
      },
    },

    trackInventory: {
      type: Boolean,
      default: true,
    },

    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, "Low stock threshold cannot be negative"],
    },

    allowBackorder: {
      type: Boolean,
      default: false,
    },

    stockStatus: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock", "discontinued"],
      default: "in_stock",
    },

    // ============================================
    // TRANSACTION HISTORY
    // ============================================
    transactionHistory: [
      {
        type: {
          type: String,
          enum: ["sale", "return", "adjustment", "restock"],
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        stockBefore: {
          type: Number,
          required: true,
        },
        stockAfter: {
          type: Number,
          required: true,
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        reason: {
          type: String,
          maxlength: 500,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ============================================
    // PRODUCT VARIANTS
    // ============================================
    hasVariants: {
      type: Boolean,
      default: false,
    },

    variants: [
      {
        sku: {
          type: String,
          // required: true,
          uppercase: true,
        },
        attributes: {
          size: String,
          color: String,
          material: String,
        },
        price: {
          type: Number,
          min: 0,
        },
        stock: {
          type: Number,
          default: 0,
          min: 0,
        },
        images: [String],
        barcode: String,
        weight: Number,
      },
    ],

    // ============================================
    // MEDIA
    // ============================================
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 10;
        },
        message: "Cannot have more than 10 images",
      },
    },

    // videoUrl: {
    //   type: String,
    //   trim: true,
    // },

    // ============================================
    // SEO & SEARCH
    // ============================================
    metaDescription: {
      type: String,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },

    tags: {
      type: [String],
      default: [],
    },

    searchKeywords: {
      type: [String],
      default: [],
    },

    // ============================================
    // BRAND & SPECIFICATIONS
    // ============================================
    brand: {
      type: String,
      trim: true,
      index: true,
      uppercase: true,
    },

    // specifications: [
    //   {
    //     key: {
    //       type: String,
    //       required: true,
    //     },
    //     value: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],

    // ============================================
    // RATINGS & REVIEWS
    // ============================================
    averageRating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: [0, "Review count cannot be negative"],
    },

    ratingDistribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
    },

    // ============================================
    // SHIPPING & DIMENSIONS
    // ============================================
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },

    weightUnit: {
      type: String,
      enum: ["kg", "lb", "g", "oz"],
      default: "kg",
    },

    dimensions: {
      length: {
        type: Number,
        min: [0, "Length cannot be negative"],
      },
      width: {
        type: Number,
        min: [0, "Width cannot be negative"],
      },
      height: {
        type: Number,
        min: [0, "Height cannot be negative"],
      },
      unit: {
        type: String,
        enum: ["cm", "m", "in", "ft"],
        default: "cm",
      },
    },

    requiresShipping: {
      type: Boolean,
      default: true,
    },

    // ============================================
    // PRODUCT STATUS & VISIBILITY
    // ============================================
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    visibility: {
      type: String,
      enum: ["public", "private", "hidden"],
      default: "public",
    },

    featuredProduct: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ============================================
    // ANALYTICS
    // ============================================
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ============================================
    // IDEMPOTENCY
    // ============================================
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true, // Allows null values, enforces uniqueness when present
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================
// INDEXES FOR QUERY OPTIMIZATION
// ============================================
// Note: slug and sku already have unique indexes from schema definition (unique: true)
// Only compound indexes and text search indexes are defined here

// Single field indexes (only fields that don't have unique: true)
productSchema.index({ userId: 1 }); // For user's products queries
productSchema.index({ category: 1 }); // For category filtering
productSchema.index({ subcategory: 1 }); // For subcategory filtering (Electronics)
productSchema.index({ isActive: 1 }); // For active products queries

// Compound indexes for common queries
productSchema.index({ category: 1, createdAt: -1 }); // Browse by category
productSchema.index({ userId: 1, status: 1 }); // Seller dashboard
productSchema.index({ status: 1, visibility: 1, publishedAt: -1 }); // Public listings
productSchema.index({ featuredProduct: 1, averageRating: -1 }); // Featured products
// productSchema.index({ brand: 1, category: 1 }); // Brand filtering (commented with brand field)

// Text search index for product search
productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
  searchKeywords: "text",
});

// Sharding key options (choose one based on your scaling needs)
// Option 1: Shard by category (good for evenly distributed categories)
// productSchema.index({ category: "hashed" });

// Option 2: Shard by userId (good for multi-tenant with many sellers)
// productSchema.index({ userId: 1, _id: 1 });

// ============================================
// VIRTUAL FIELDS
// ============================================

// Display price formatted
productSchema.virtual("displayPrice").get(function () {
  return this.price;
});

// Display sale price formatted
productSchema.virtual("displaySalePrice").get(function () {
  return this.salePrice || null;
});

// Calculate discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.salePrice && this.price > this.salePrice) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Check if product is in stock
productSchema.virtual("isInStock").get(function () {
  if (!this.trackInventory) return true;
  if (this.allowBackorder) return true;
  return this.stock > 0;
});

// ============================================
// MIDDLEWARE - PRE SAVE HOOKS
// ============================================

// Counter for SKU increment (in production, use Redis or a separate collection)
let skuCounter = 1000;

productSchema.pre("save", async function (next) {
  // Generate slug from name if not provided
  if (!this.slug || this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Ensure slug uniqueness
    const existingProduct = await mongoose.models.product.findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    });

    if (existingProduct) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }

  // Auto-generate SKU if not provided
  // Pattern: {CATEGORY_PREFIX}-{BRAND_PREFIX}-{COLOR_PREFIX}-{INCREMENT_NUMBER}
  if (!this.sku) {
    const categoryPrefix = this.category.substring(0, 3).toUpperCase();

    // If brand is enabled in the future, uncomment this:
    // const brandPrefix = this.brand 
    //   ? this.brand.substring(0, 3).toUpperCase() 
    //   : "GEN";
    const brandPrefix = "GEN"; // Generic brand for now

    const colorPrefix = this.color
      ? this.color.substring(0, 3).toUpperCase()
      : "STD";

    // Increment counter (in production, use atomic counter from DB)
    skuCounter++;
    const incrementNumber = String(skuCounter).padStart(4, "0");

    this.sku = `${categoryPrefix}-${brandPrefix}-${colorPrefix}-${incrementNumber}`;

    // Ensure SKU uniqueness
    const existingSku = await mongoose.models.product.findOne({
      sku: this.sku,
      _id: { $ne: this._id },
    });

    if (existingSku) {
      // Add random suffix if collision occurs
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      this.sku = `${this.sku}-${randomSuffix}`;
    }
  }

  // Update search keywords from name and tags
  if (this.isModified("name") || this.isModified("tags")) {
    const nameWords = this.name.toLowerCase().split(/\s+/);
    const combinedKeywords = [...nameWords, ...this.tags.map(t => t.toLowerCase())];
    this.searchKeywords = [...new Set(combinedKeywords)]; // Remove duplicates
  }

  // Validate sale price is less than regular price
  if (this.salePrice && this.salePrice >= this.price) {
    return next(new Error("Sale price must be less than regular price"));
  }

  // Update stock status based on inventory
  if (this.trackInventory) {
    if (this.stock === 0) {
      this.stockStatus = "out_of_stock";
    } else if (this.stock <= this.lowStockThreshold) {
      this.stockStatus = "low_stock";
    } else {
      this.stockStatus = "in_stock";
    }
  }

  // Set publishedAt timestamp when status changes to published
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// ============================================
// INSTANCE METHODS
// ============================================

// Update product rating
productSchema.methods.updateRating = function (newRating, oldRating = null) {
  if (oldRating) {
    // Update existing review
    this.ratingDistribution[oldRating] = Math.max(0, this.ratingDistribution[oldRating] - 1);
  } else {
    // New review
    this.reviewCount += 1;
  }

  // Add new rating
  this.ratingDistribution[newRating] += 1;

  // Calculate new average
  const totalRating = Object.entries(this.ratingDistribution).reduce(
    (sum, [rating, count]) => sum + parseInt(rating) * count,
    0
  );
  this.averageRating = totalRating / this.reviewCount;

  return this.save();
};

// Increment view count
productSchema.methods.incrementView = function () {
  this.viewCount += 1;
  return this.save();
};

// Decrement stock with transaction history
productSchema.methods.decrementStock = function (quantity, orderId = null, reason = "Sale") {
  if (!this.trackInventory) {
    return Promise.resolve(this);
  }

  if (this.stock < quantity && !this.allowBackorder) {
    throw new Error("Insufficient stock");
  }

  const stockBefore = this.stock;
  this.stock = Math.max(0, this.stock - quantity);
  const stockAfter = this.stock;

  // Record transaction
  this.transactionHistory.push({
    type: "sale",
    quantity: -quantity, // Negative for stock reduction
    stockBefore,
    stockAfter,
    orderId,
    reason,
    timestamp: new Date(),
  });

  return this.save();
};

// Increment stock (for returns/restocks)
productSchema.methods.incrementStock = function (quantity, orderId = null, reason = "Restock") {
  const stockBefore = this.stock;
  this.stock += quantity;
  const stockAfter = this.stock;

  // Record transaction
  this.transactionHistory.push({
    type: reason.toLowerCase() === "return" ? "return" : "restock",
    quantity: quantity, // Positive for stock increase
    stockBefore,
    stockAfter,
    orderId,
    reason,
    timestamp: new Date(),
  });

  return this.save();
};

// Adjust stock (for corrections/audits)
productSchema.methods.adjustStock = function (newStock, reason = "Manual adjustment") {
  const stockBefore = this.stock;
  this.stock = newStock;
  const stockAfter = this.stock;
  const quantityChange = stockAfter - stockBefore;

  // Record transaction
  this.transactionHistory.push({
    type: "adjustment",
    quantity: quantityChange,
    stockBefore,
    stockAfter,
    reason,
    timestamp: new Date(),
  });

  return this.save();
};

// Check availability
productSchema.methods.checkAvailability = function (quantity = 1) {
  if (!this.trackInventory) return true;
  if (this.allowBackorder) return true;
  return this.stock >= quantity;
};

// Get recent transaction history
productSchema.methods.getRecentTransactions = function (limit = 10) {
  return this.transactionHistory
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

const Product = mongoose.model("product", productSchema);

export default Product;
