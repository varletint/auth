import Sale from "../Models/sale.js";
import InventoryItem from "../Models/inventoryItem.js";
import Customer from "../Models/customer.js";
import { errorHandler } from "../Utilis/errorHandler.js";

/**
 * Get all sales for a user
 * GET /api/sales
 */
export const getSales = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, startDate, endDate, customer, paymentStatus } = req.query;

        const query = { userId };

        // Date range filter
        if (startDate || endDate) {
            query.saleDate = {};
            if (startDate) query.saleDate.$gte = new Date(startDate);
            if (endDate) query.saleDate.$lte = new Date(endDate);
        }

        // Customer filter
        if (customer) {
            query.customer = customer;
        }

        // Payment status filter
        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const sales = await Sale.find(query)
            .populate("customer", "name phone")
            .sort({ saleDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalSales = await Sale.countDocuments(query);

        res.status(200).json({
            success: true,
            sales,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalSales,
                totalPages: Math.ceil(totalSales / parseInt(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a single sale
 * GET /api/sales/:id
 */
export const getSale = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const sale = await Sale.findOne({ _id: id, userId }).populate("customer", "name phone email");

        if (!sale) {
            return next(errorHandler(404, "Sale not found"));
        }

        res.status(200).json({
            success: true,
            sale,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new sale
 * POST /api/sales
 */
export const createSale = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { items, customer, customerName, totalAmount, paymentMethod, paymentStatus, amountPaid, saleDate, notes } = req.body;

        if (!items || items.length === 0) {
            return next(errorHandler(400, "At least one item is required"));
        }

        if (!totalAmount || totalAmount <= 0) {
            return next(errorHandler(400, "Total amount must be greater than 0"));
        }

        // Process items - deduct from inventory and get cost prices
        const processedItems = [];
        for (const item of items) {
            let costPrice = 0;

            if (item.inventoryItem) {
                // Get inventory item and update stock
                const invItem = await InventoryItem.findOne({ _id: item.inventoryItem, userId });
                if (invItem) {
                    if (invItem.quantity < item.quantity) {
                        return next(errorHandler(400, `Insufficient stock for ${invItem.name}. Available: ${invItem.quantity}`));
                    }
                    invItem.quantity -= item.quantity;
                    await invItem.save();
                    costPrice = invItem.costPrice;
                }
            }

            processedItems.push({
                inventoryItem: item.inventoryItem,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                costPrice: item.costPrice || costPrice,
                subtotal: item.quantity * item.unitPrice,
            });
        }

        const newSale = new Sale({
            userId,
            items: processedItems,
            customer,
            customerName: customerName || "Walk-in Customer",
            totalAmount,
            paymentMethod: paymentMethod || "cash",
            paymentStatus: paymentStatus || "paid",
            amountPaid: amountPaid !== undefined ? amountPaid : totalAmount,
            saleDate: saleDate || new Date(),
            notes,
        });

        const savedSale = await newSale.save();

        // Update customer stats if customer is linked
        if (customer) {
            await Customer.findByIdAndUpdate(customer, {
                $inc: { totalPurchases: 1, totalSpent: totalAmount },
                $set: { lastPurchaseDate: new Date() },
            });
        }

        res.status(201).json({
            success: true,
            message: "Sale recorded successfully",
            sale: savedSale,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update a sale (limited fields)
 * PUT /api/sales/:id
 */
export const updateSale = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const sale = await Sale.findOne({ _id: id, userId });

        if (!sale) {
            return next(errorHandler(404, "Sale not found"));
        }

        // Only allow updating certain fields
        const allowedUpdates = ["paymentStatus", "amountPaid", "notes", "paymentMethod"];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                sale[field] = req.body[field];
            }
        });

        const updatedSale = await sale.save();

        res.status(200).json({
            success: true,
            message: "Sale updated successfully",
            sale: updatedSale,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a sale (soft delete)
 * DELETE /api/sales/:id
 */
export const deleteSale = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const sale = await Sale.findOne({ _id: id, userId });

        if (!sale) {
            return next(errorHandler(404, "Sale not found"));
        }

        // Restore inventory quantities
        for (const item of sale.items) {
            if (item.inventoryItem) {
                await InventoryItem.findByIdAndUpdate(item.inventoryItem, {
                    $inc: { quantity: item.quantity },
                });
            }
        }

        sale.isDeleted = true;
        await sale.save();

        res.status(200).json({
            success: true,
            message: "Sale deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get sales summary/stats
 * GET /api/sales/stats
 */
export const getSalesStats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { period = "today" } = req.query;

        let startDate;
        const endDate = new Date();

        switch (period) {
            case "today":
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                break;
            case "week":
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case "month":
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case "year":
                startDate = new Date();
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
        }

        const sales = await Sale.find({
            userId,
            saleDate: { $gte: startDate, $lte: endDate },
        });

        const totalSales = sales.length;
        const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
        const totalCost = sales.reduce((sum, s) => sum + s.totalCost, 0);
        const totalProfit = totalRevenue - totalCost;
        const totalItems = sales.reduce((sum, s) => sum + s.itemCount, 0);

        // Pending payments
        const pendingSales = sales.filter((s) => s.paymentStatus !== "paid");
        const pendingAmount = pendingSales.reduce((sum, s) => sum + s.balance, 0);

        res.status(200).json({
            success: true,
            stats: {
                period,
                totalSales,
                totalRevenue,
                totalCost,
                totalProfit,
                profitMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0,
                totalItems,
                pendingPayments: pendingSales.length,
                pendingAmount,
            },
        });
    } catch (error) {
        next(error);
    }
};
