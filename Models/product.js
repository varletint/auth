import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
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

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

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

productSchema.index({ userId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ isActive: 1 });

// Compound indexes for common queries
productSchema.index({ category: 1, createdAt: -1 }); // Browse by category
productSchema.index({ userId: 1, status: 1 }); // Seller dashboard
productSchema.index({ status: 1, visibility: 1, publishedAt: -1 }); // Public listings
productSchema.index({ featuredProduct: 1, averageRating: -1 }); // Featured products


// Text search index for product search
productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
  searchKeywords: "text",
});

productSchema.virtual("displayPrice").get(function () {
  return this.price;
});

productSchema.virtual("displaySalePrice").get(function () {
  return this.salePrice || null;
});

productSchema.virtual("discountPercentage").get(function () {
  if (this.salePrice && this.price > this.salePrice) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

productSchema.virtual("isInStock").get(function () {
  if (!this.trackInventory) return true;
  if (this.allowBackorder) return true;
  return this.stock > 0;
});

let skuCounter = 1000;

productSchema.pre("save", async function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existingProduct = await mongoose.models.product.findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    });

    if (existingProduct) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }

  if (!this.sku) {
    const categoryPrefix = this.category.substring(0, 3).toUpperCase();

    const brandPrefix = "GEN";

    const colorPrefix = this.color
      ? this.color.substring(0, 3).toUpperCase()
      : "STD";

    skuCounter++; // use atomic counter
    const incrementNumber = String(skuCounter).padStart(4, "0");

    this.sku = `${categoryPrefix}-${brandPrefix}-${colorPrefix}-${incrementNumber}`;

    const existingSku = await mongoose.models.product.findOne({
      sku: this.sku,
      _id: { $ne: this._id },
    });

    if (existingSku) {
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      this.sku = `${this.sku}-${randomSuffix}`;
    }
  }

  if (this.isModified("name") || this.isModified("tags")) {
    const nameWords = this.name.toLowerCase().split(/\s+/);
    const combinedKeywords = [...nameWords, ...this.tags.map(t => t.toLowerCase())];
    this.searchKeywords = [...new Set(combinedKeywords)]; // Remove duplicates
  }

  if (this.salePrice && this.salePrice >= this.price) {
    return next(new Error("Sale price must be less than regular price"));
  }

  if (this.trackInventory) {
    if (this.stock === 0) {
      this.stockStatus = "out_of_stock";
    } else if (this.stock <= this.lowStockThreshold) {
      this.stockStatus = "low_stock";
    } else {
      this.stockStatus = "in_stock";
    }
  }

  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});


productSchema.methods.updateRating = function (newRating, oldRating = null) {
  if (oldRating) {

    this.ratingDistribution[oldRating] = Math.max(0, this.ratingDistribution[oldRating] - 1);
  } else {

    this.reviewCount += 1;
  }

  this.ratingDistribution[newRating] += 1;

  const totalRating = Object.entries(this.ratingDistribution).reduce(
    (sum, [rating, count]) => sum + parseInt(rating) * count,
    0
  );
  this.averageRating = totalRating / this.reviewCount;

  return this.save();
};

productSchema.methods.incrementView = function () {
  this.viewCount += 1;
  return this.save();
};

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

productSchema.methods.incrementStock = function (quantity, orderId = null, reason = "Restock") {
  const stockBefore = this.stock;
  this.stock += quantity;
  const stockAfter = this.stock;
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

productSchema.methods.adjustStock = function (newStock, reason = "Manual adjustment") {
  const stockBefore = this.stock;
  this.stock = newStock;
  const stockAfter = this.stock;
  const quantityChange = stockAfter - stockBefore;

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

productSchema.methods.checkAvailability = function (quantity = 1) {
  if (!this.trackInventory) return true;
  if (this.allowBackorder) return true;
  return this.stock >= quantity;
};

productSchema.methods.getRecentTransactions = function (limit = 10) {
  return this.transactionHistory
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

const Product = mongoose.model("product", productSchema);

export default Product;
