import Product from "../Models/product.js";
import U from "../Models/user.js";
import UserDetails from "../Models/userDetails.js";
// import redisClient, { isRedisAvailable } from "../config/redis.js";
import { errorHandler } from "../Utilis/errorHandler.js";
import { validateProductInput } from "../Utilis/validation.js";
import { deleteMultipleFilesFromStorage } from "../config/firebaseAdmin.js";
import dayjs from "dayjs";


// const CACHE_EXPIRATION = 3600; // 1 hour

// Helper to clear cache
// const clearProductCache = async (productId = null) => {
//     if (!redisClient.isOpen) return;
//     try {
//         const keys = await redisClient.keys('products_list:*');
//         if (keys.length > 0) {
//             await redisClient.del(keys);
//         }

//         if (productId) {
//             await redisClient.del(`product:${productId}`);
//         }
//     } catch (error) {
//         console.error("Cache clear error:", error);
//     }
// };

// export const testCreate = async (req, res, next) => {
//     try {
//         const { name, price, category, stock, images, description, sku, isActive } = req.body;

//         const newProduct = new Product({
//             name: name.trim(),
//             price: Number(price),
//             category: category.trim(),
//             stock: stock ? Number(stock) : 0,
//             images: images || [],
//             description: description ? description.trim() : undefined,
//             // sku: sku ? sku.trim() : undefined,
//             brand: brand ? brand.trim() : undefined,
//             isActive: isActive !== undefined ? isActive : true,
//             userId: '1'
//         });

//         const savedProduct = await newProduct.save();

//         // await clearProductCache();

//         res.status(201).json(savedProduct);




//     } catch (error) {
//         next(error);

//     }
// }

export const createProduct = async (req, res, next) => {
    try {
        // Get user data to verify profile completeness and post count
        const user = await U.findById(req.user.id);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // ============================================
        // IDEMPOTENCY CHECK
        // ============================================
        const idempotencyKey = req.headers['x-idempotency-key'];
        if (idempotencyKey) {
            const existingProduct = await Product.findOne({ idempotencyKey });
            if (existingProduct) {
                // Return existing product to prevent duplicate creation
                console.log(`Idempotency hit: returning existing product ${existingProduct._id}`);
                return res.status(200).json(existingProduct);
            }
        }

        // Check 0: Verify user has seller role
        if (!user.role || !user.role.includes('seller')) {
            return next(errorHandler(403, "You must be an approved seller to create products. Apply at /become-seller"));
        }

        // Check 1: Verify profile is complete
        const missingFields = [];
        if (!user.email || user.email.trim() === '') missingFields.push('email');

        // Fetch userDetails to check business_name (stored in UserDetails, not User)
        const userDetails = await UserDetails.findOne({ user_id: req.user.id }).setOptions({ skipPopulate: true });

        if (!userDetails?.fullName || userDetails.fullName.trim() === '') missingFields.push('fullname');
        if (!userDetails?.businessInfo?.businessName || userDetails.businessInfo.businessName.trim() === '') missingFields.push('business_name');

        if (missingFields.length > 0) {
            return next(errorHandler(400, `Please complete your profile. Missing: ${missingFields.join(', ')}`));
        }

        // Check 2: Verify post count limits
        const now = dayjs();
        const resetDate = dayjs(user.postResetAt);

        // If the reset date has passed, reset the counter
        if (now.isAfter(resetDate)) {
            user.post_count = 0;
            user.postResetAt = dayjs().add(7, 'days').startOf('day').toDate();
            await user.save();
        }

        // Check if user has reached post limit
        if (user.post_count >= 7) {
            const resetDateFormatted = dayjs(user.postResetAt).format('MMMM D, YYYY');
            return next(errorHandler(429, `You have reached your posting limit (7 posts per week). You can post again on ${resetDateFormatted}`));
        }

        const validationError = validateProductInput(req.body);
        if (validationError) {
            return next(errorHandler(400, validationError));
        }

        const { name, title, price, category, stock, images, description, sku, isActive, brand, subcategory, model, color } = req.body;

        // Accept both 'name' and 'title' for product name
        const productName = name || title;
        if (!productName) {
            return next(errorHandler(400, "Product name/title is required"));
        }

        const newProduct = new Product({
            name: productName.trim(),
            price: Number(price),
            category: category.trim(),
            stock: stock ? Number(stock) : 0,
            images: images || [],
            description: description ? description.trim() : undefined,
            sku: sku ? sku.trim() : undefined,
            brand: brand ? brand.trim() : undefined,
            subcategory: subcategory ? subcategory.trim() : undefined,
            model: model ? model.trim() : undefined,
            color: color ? color.trim() : undefined,
            isActive: isActive !== undefined ? isActive : true,
            userId: req.user.id,
            idempotencyKey: idempotencyKey || undefined, // Store idempotency key if provided
        });

        const savedProduct = await newProduct.save();

        // Increment user's post count
        user.post_count += 1;
        await user.save();

        // await clearProductCache();

        res.status(201).json(savedProduct);
    } catch (error) {
        // Handle duplicate key error (e.g., for SKU)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return next(errorHandler(400, `Duplicate value for field: ${field}`));
        }
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const validationError = validateProductInput(req.body, true);
        if (validationError) {
            return next(errorHandler(400, validationError));
        }

        const { name, price, category, stock, images, description, sku, isActive } = req.body;

        const updateData = { ...req.body };
        // Sanitize inputs
        if (name) updateData.name = name.trim();
        if (price !== undefined) updateData.price = Number(price);
        if (category) updateData.category = category.trim();
        if (stock !== undefined) updateData.stock = Number(stock);
        if (description) updateData.description = description.trim();
        if (sku) updateData.sku = sku.trim();

        const product = await Product.findById(req.params.id);
        if (!product) return next(errorHandler(404, "Product not found"));

        if (product.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(errorHandler(403, "You are not authorized to update this product"));
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) return next(errorHandler(404, "Product not found"));

        // await clearProductCache(req.params.id);

        res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return next(errorHandler(400, `Duplicate value for field: ${field}`));
        }
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return next(errorHandler(404, "Product not found"));

        if (product.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(errorHandler(403, "You are not authorized to delete this product"));
        }

        // Delete images from Firebase Storage
        if (product.images && product.images.length > 0) {
            const deleteResult = await deleteMultipleFilesFromStorage(product.images);
            console.log(`Deleted ${deleteResult.success} images, ${deleteResult.failed} failed`);
        }

        await Product.findByIdAndDelete(req.params.id);

        // await clearProductCache(req.params.id);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const productGet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return next(errorHandler(404, "Product not found"));
        const { ...ok } = product._doc;
        res.status(200).json(ok);
    } catch (error) {
        next(error);
    }
}

export const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check cache
        // if (redisClient.isOpen) {
        //     const cachedProduct = await redisClient.get(`product:${id}`);
        //     if (cachedProduct) {
        //         return res.status(200).json(JSON.parse(cachedProduct));
        //     }
        // }

        const product = await Product.findById(id);
        if (!product) return next(errorHandler(404, "Product not found"));

        // Increment view count
        await product.incrementView();

        // Set cache
        // if (redisClient.isOpen) {
        //     await redisClient.setEx(`product:${id}`, CACHE_EXPIRATION, JSON.stringify(product));
        // }

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const getProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, minPrice, maxPrice, sort, name, searchTerm, userId } = req.query;

        // Create a unique cache key based on query params
        // const cacheKey = `products_list:${JSON.stringify(req.query)}`;

        // if (redisClient.isOpen) {
        //     const cachedList = await redisClient.get(cacheKey);
        //     if (cachedList) {
        //         return res.status(200).json(JSON.parse(cachedList));
        //     }
        // }

        const query = {};
        if (category) query.category = category;
        if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive name search
        if (userId) query.userId = userId; // Filter by user ID

        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const sortOptions = {};
        if (sort === 'newest') {
            sortOptions.createdAt = -1;
        } else if (sort === 'oldest') {
            sortOptions.createdAt = 1;
        } else if (sort) {
            const parts = sort.split(':');
            sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        } else {
            sortOptions.createdAt = -1; // Default sort by newest
        }

        const products = await Product.find(query)
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Product.countDocuments(query);

        const response = {
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalProducts: count
        };

        // Set cache
        // if (redisClient.isOpen) {
        //     await redisClient.setEx(cacheKey, CACHE_EXPIRATION, JSON.stringify(response));
        // }

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Restock a product
 * PATCH /api/products/:id/restock
 */
export const restockProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity, reason } = req.body;

        // Validate quantity
        if (!quantity || quantity < 1) {
            return next(errorHandler(400, "Quantity must be at least 1"));
        }

        if (!Number.isInteger(quantity)) {
            return next(errorHandler(400, "Quantity must be a whole number"));
        }

        const product = await Product.findById(id);
        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        // Verify seller owns this product
        if (product.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(errorHandler(403, "You are not authorized to restock this product"));
        }

        // Use existing incrementStock method (logs to transactionHistory)
        const restockReason = reason || "Manual restock";
        await product.incrementStock(quantity, null, restockReason);

        res.status(200).json({
            success: true,
            message: `Successfully restocked ${quantity} units`,
            product: {
                id: product._id,
                name: product.name,
                stockBefore: product.stock - quantity,
                stockAfter: product.stock,
                quantity: quantity,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get product transaction history
 * GET /api/products/:id/transactions
 */
export const getProductTransactionHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20, type } = req.query;

        const product = await Product.findById(id);
        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        // Verify seller owns this product
        if (product.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(errorHandler(403, "You are not authorized to view this product's history"));
        }

        // Get transaction history
        let transactions = product.transactionHistory || [];

        // Filter by type if specified
        if (type && ["sale", "return", "adjustment", "restock"].includes(type)) {
            transactions = transactions.filter(t => t.type === type);
        }

        // Sort by timestamp (newest first)
        transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Paginate
        const total = transactions.length;
        const startIndex = (page - 1) * limit;
        const paginatedTransactions = transactions.slice(startIndex, startIndex + parseInt(limit));

        res.status(200).json({
            success: true,
            transactions: paginatedTransactions,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            product: {
                id: product._id,
                name: product.name,
                currentStock: product.stock,
            },
        });
    } catch (error) {
        next(error);
    }
};
