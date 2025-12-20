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
        const {
            name,
            description,
            sku,
            category,
            costPrice,
            sellingPrice,
            quantity,
            lowStockThreshold,
            unit,
            // Multi-unit fields
            hasMultipleUnits,
            baseUnit,
            baseQuantity,
            sellingUnits,
            idempotencyKey,
        } = req.body;

        // ==================== Idempotency Check ====================
        if (idempotencyKey) {
            const existingItem = await InventoryItem.findOne({ userId, idempotencyKey });
            if (existingItem) {
                return res.status(200).json({
                    success: true,
                    message: "Item already created (duplicate request)",
                    item: existingItem,
                    duplicate: true,
                });
            }
        }

        if (!name) {
            return next(errorHandler(400, "Item name is required"));
        }

        const stockHistory = [];

        // Handle multi-unit items
        if (hasMultipleUnits) {
            if (!baseUnit) {
                return next(errorHandler(400, "Base unit is required for multi-unit items"));
            }
            if (!sellingUnits || sellingUnits.length === 0) {
                return next(errorHandler(400, "At least one selling unit is required"));
            }

            // Validate selling units have required fields
            for (const unit of sellingUnits) {
                if (!unit.name || !unit.conversionFactor || unit.sellingPrice === undefined) {
                    return next(errorHandler(400, "Each selling unit must have name, conversion factor, and selling price"));
                }
            }

            // Ensure at least one default unit
            const hasDefault = sellingUnits.some(u => u.isDefault);
            if (!hasDefault && sellingUnits.length > 0) {
                sellingUnits[0].isDefault = true;
            }

            const initialBaseQuantity = baseQuantity || 0;

            // Record initial stock
            if (initialBaseQuantity > 0) {
                const defaultUnit = sellingUnits.find(u => u.isDefault) || sellingUnits[0];
                stockHistory.push({
                    type: "in",
                    quantity: initialBaseQuantity,
                    reason: "Initial stock",
                    referenceType: "Initial",
                    costPriceAtTime: defaultUnit.costPrice || 0,
                    sellingPriceAtTime: defaultUnit.sellingPrice,
                    balanceAfter: initialBaseQuantity,
                    valueAfter: initialBaseQuantity * (defaultUnit.costPrice || 0) / defaultUnit.conversionFactor,
                    createdBy: userId,
                    createdAt: new Date(),
                });
            }

            const newItem = new InventoryItem({
                userId,
                name,
                description,
                sku,
                category,
                hasMultipleUnits: true,
                baseUnit,
                baseQuantity: initialBaseQuantity,
                sellingUnits,
                lowStockThreshold: lowStockThreshold || 5,
                // For backwards compatibility, also set standard fields using default unit
                unit: baseUnit,
                quantity: initialBaseQuantity,
                costPrice: sellingUnits[0]?.costPrice || 0,
                sellingPrice: sellingUnits[0]?.sellingPrice || 0,
                stockHistory,
                idempotencyKey: idempotencyKey || undefined,
            });

            const savedItem = await newItem.save();

            return res.status(201).json({
                success: true,
                message: "Multi-unit inventory item created successfully",
                item: savedItem,
            });
        }

        // Handle standard (single-unit) items
        if (costPrice === undefined || sellingPrice === undefined) {
            return next(errorHandler(400, "Cost price and selling price are required"));
        }

        const initialQuantity = quantity || 0;

        // Record initial stock as first history entry
        if (initialQuantity > 0) {
            stockHistory.push({
                type: "in",
                quantity: initialQuantity,
                reason: "Initial stock",
                referenceType: "Initial",
                costPriceAtTime: costPrice,
                sellingPriceAtTime: sellingPrice,
                balanceAfter: initialQuantity,
                valueAfter: initialQuantity * costPrice,
                createdBy: userId,
                createdAt: new Date(),
            });
        }

        const newItem = new InventoryItem({
            userId,
            name,
            description,
            sku,
            category,
            costPrice,
            sellingPrice,
            quantity: initialQuantity,
            lowStockThreshold: lowStockThreshold || 5,
            unit: unit || "pieces",
            hasMultipleUnits: false,
            stockHistory,
            idempotencyKey: idempotencyKey || undefined,
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

        // Allow updating all relevant fields including multi-unit fields
        const allowedUpdates = [
            "name", "description", "sku", "category",
            "costPrice", "sellingPrice", "quantity",
            "lowStockThreshold", "unit", "isActive",
            // Multi-unit fields
            "hasMultipleUnits", "baseUnit", "baseQuantity", "sellingUnits"
        ];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                item[field] = req.body[field];
            }
        });

        // If switching to multi-unit mode, sync quantity fields
        if (item.hasMultipleUnits) {
            item.quantity = item.baseQuantity;
        }

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
        const { quantity, costPrice, reason, idempotencyKey } = req.body;

        if (!quantity || quantity <= 0) {
            return next(errorHandler(400, "Quantity must be a positive number"));
        }

        const item = await InventoryItem.findOne({ _id: id, userId });

        if (!item) {
            return next(errorHandler(404, "Inventory item not found"));
        }

        // Idempotency check - if key exists, return existing entry
        if (idempotencyKey) {
            const existingEntry = item.stockHistory.find(
                (h) => h.idempotencyKey === idempotencyKey
            );
            if (existingEntry) {
                return res.status(200).json({
                    success: true,
                    message: "Restock already processed (idempotent)",
                    item,
                    duplicate: true,
                });
            }
        }

        // Update quantity and cost price
        item.quantity += quantity;
        const updatedCostPrice = costPrice !== undefined ? costPrice : item.costPrice;
        if (costPrice !== undefined) {
            item.costPrice = costPrice;
        }

        // Add history entry
        item.stockHistory.push({
            type: "in",
            quantity,
            reason: reason || "Restock",
            referenceType: "Manual",
            costPriceAtTime: updatedCostPrice,
            sellingPriceAtTime: item.sellingPrice,
            balanceAfter: item.quantity,
            valueAfter: item.quantity * updatedCostPrice,
            idempotencyKey,
            createdBy: userId,
            createdAt: new Date(),
        });

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
 * Stock out an inventory item (manual deduction)
 * PATCH /api/inventory/:id/stock-out
 */
export const stockOutInventoryItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { quantity, reason, idempotencyKey } = req.body;

        if (!quantity || quantity <= 0) {
            return next(errorHandler(400, "Quantity must be a positive number"));
        }

        if (!reason) {
            return next(errorHandler(400, "Reason is required for stock out"));
        }

        const item = await InventoryItem.findOne({ _id: id, userId });

        if (!item) {
            return next(errorHandler(404, "Inventory item not found"));
        }

        if (item.quantity < quantity) {
            return next(errorHandler(400, `Insufficient stock. Available: ${item.quantity}`));
        }

        // Idempotency check
        if (idempotencyKey) {
            const existingEntry = item.stockHistory.find(
                (h) => h.idempotencyKey === idempotencyKey
            );
            if (existingEntry) {
                return res.status(200).json({
                    success: true,
                    message: "Stock out already processed (idempotent)",
                    item,
                    duplicate: true,
                });
            }
        }

        // Update quantity
        item.quantity -= quantity;

        // Add history entry
        item.stockHistory.push({
            type: "out",
            quantity: -quantity,
            reason,
            referenceType: "Manual",
            costPriceAtTime: item.costPrice,
            sellingPriceAtTime: item.sellingPrice,
            balanceAfter: item.quantity,
            valueAfter: item.quantity * item.costPrice,
            idempotencyKey,
            createdBy: userId,
            createdAt: new Date(),
        });

        const updatedItem = await item.save();

        res.status(200).json({
            success: true,
            message: `Removed ${quantity} units from ${item.name}`,
            item: updatedItem,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get item with full history
 * GET /api/inventory/:id/history
 */
export const getItemWithHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const item = await InventoryItem.findOne({ _id: id, userId });

        if (!item) {
            return next(errorHandler(404, "Inventory item not found"));
        }

        // Sort history by date descending (newest first)
        const sortedHistory = item.stockHistory.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.status(200).json({
            success: true,
            item: {
                ...item.toObject(),
                stockHistory: sortedHistory,
            },
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
