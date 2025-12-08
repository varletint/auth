import InventoryItem from "../Models/inventoryItem.js";
import { errorHandler } from "../Utilis/errorHandler.js";

/**
 * Get all inventory items for a user
 * GET /api/inventory
 */
export const getInventoryItems = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, search, category, lowStock } = req.query;

        const query = { userId };

        // Search by name or SKU
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let items = await InventoryItem.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Filter low stock items if requested
        if (lowStock === "true") {
            items = items.filter((item) => item.quantity <= item.lowStockThreshold);
        }

        const totalItems = await InventoryItem.countDocuments(query);

        res.status(200).json({
            success: true,
            items,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalItems,
                totalPages: Math.ceil(totalItems / parseInt(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a single inventory item
 * GET /api/inventory/:id
 */
export const getInventoryItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const item = await InventoryItem.findOne({ _id: id, userId });

        if (!item) {
            return next(errorHandler(404, "Inventory item not found"));
        }

        res.status(200).json({
            success: true,
            item,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new inventory item
 * POST /api/inventory
 */
export const createInventoryItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, description, sku, category, costPrice, sellingPrice, quantity, lowStockThreshold, unit } = req.body;

        if (!name || costPrice === undefined || sellingPrice === undefined) {
            return next(errorHandler(400, "Name, cost price, and selling price are required"));
        }

        const newItem = new InventoryItem({
            userId,
            name,
            description,
            sku,
            category,
            costPrice,
            sellingPrice,
            quantity: quantity || 0,
            lowStockThreshold: lowStockThreshold || 5,
            unit: unit || "pieces",
        });

        const savedItem = await newItem.save();

        res.status(201).json({
            success: true,
            message: "Inventory item created successfully",
            item: savedItem,
        });
    } catch (error) {
        if (error.code === 11000) {
            return next(errorHandler(400, "An item with this SKU already exists"));
        }
        next(error);
    }
};

/**
 * Update an inventory item
 * PUT /api/inventory/:id
 */
export const updateInventoryItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const item = await InventoryItem.findOne({ _id: id, userId });

        if (!item) {
            return next(errorHandler(404, "Inventory item not found"));
        }

        const allowedUpdates = ["name", "description", "sku", "category", "costPrice", "sellingPrice", "quantity", "lowStockThreshold", "unit", "isActive"];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                item[field] = req.body[field];
            }
        });

        const updatedItem = await item.save();

        res.status(200).json({
            success: true,
            message: "Inventory item updated successfully",
            item: updatedItem,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete an inventory item (soft delete)
 * DELETE /api/inventory/:id
 */
export const deleteInventoryItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const item = await InventoryItem.findOne({ _id: id, userId });

        if (!item) {
            return next(errorHandler(404, "Inventory item not found"));
        }

        item.isDeleted = true;
        await item.save();

        res.status(200).json({
            success: true,
            message: "Inventory item deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Restock an inventory item
 * PATCH /api/inventory/:id/restock
 */
export const restockInventoryItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { quantity, costPrice } = req.body;

        if (!quantity || quantity <= 0) {
            return next(errorHandler(400, "Quantity must be a positive number"));
        }

        const item = await InventoryItem.findOne({ _id: id, userId });

        if (!item) {
            return next(errorHandler(404, "Inventory item not found"));
        }

        item.quantity += quantity;
        if (costPrice !== undefined) {
            item.costPrice = costPrice;
        }

        const updatedItem = await item.save();

        res.status(200).json({
            success: true,
            message: `Added ${quantity} units to ${item.name}`,
            item: updatedItem,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get inventory summary/stats
 * GET /api/inventory/stats
 */
export const getInventoryStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const items = await InventoryItem.find({ userId });

        const totalItems = items.length;
        const totalValue = items.reduce((sum, item) => sum + item.stockValue, 0);
        const lowStockItems = items.filter((item) => item.isLowStock).length;
        const outOfStock = items.filter((item) => item.quantity === 0).length;

        // Get category breakdown
        const categoryBreakdown = items.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            stats: {
                totalItems,
                totalValue,
                lowStockItems,
                outOfStock,
                categoryBreakdown,
            },
        });
    } catch (error) {
        next(error);
    }
};
