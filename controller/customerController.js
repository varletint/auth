import Customer from "../Models/customer.js";
import { errorHandler } from "../Utilis/errorHandler.js";

/**
 * Get all customers for a user
 * GET /api/customers
 */
export const getCustomers = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, search } = req.query;

        const query = { userId };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const customers = await Customer.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalCustomers = await Customer.countDocuments(query);

        res.status(200).json({
            success: true,
            customers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalCustomers,
                totalPages: Math.ceil(totalCustomers / parseInt(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a single customer
 * GET /api/customers/:id
 */
export const getCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const customer = await Customer.findOne({ _id: id, userId });

        if (!customer) {
            return next(errorHandler(404, "Customer not found"));
        }

        res.status(200).json({
            success: true,
            customer,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new customer
 * POST /api/customers
 */
export const createCustomer = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, phone, email, address, notes } = req.body;

        if (!name) {
            return next(errorHandler(400, "Customer name is required"));
        }

        const newCustomer = new Customer({
            userId,
            name,
            phone,
            email,
            address,
            notes,
        });

        const savedCustomer = await newCustomer.save();

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            customer: savedCustomer,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update a customer
 * PUT /api/customers/:id
 */
export const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const customer = await Customer.findOne({ _id: id, userId });

        if (!customer) {
            return next(errorHandler(404, "Customer not found"));
        }

        const allowedUpdates = ["name", "phone", "email", "address", "notes", "isActive"];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                customer[field] = req.body[field];
            }
        });

        const updatedCustomer = await customer.save();

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            customer: updatedCustomer,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a customer (soft delete)
 * DELETE /api/customers/:id
 */
export const deleteCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const customer = await Customer.findOne({ _id: id, userId });

        if (!customer) {
            return next(errorHandler(404, "Customer not found"));
        }

        customer.isDeleted = true;
        await customer.save();

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get customer stats
 * GET /api/customers/stats
 */
export const getCustomerStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const customers = await Customer.find({ userId });

        const totalCustomers = customers.length;
        const activeCustomers = customers.filter((c) => c.isActive).length;
        const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

        // Top customers by spending
        const topCustomers = [...customers]
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5)
            .map((c) => ({
                id: c._id,
                name: c.name,
                totalSpent: c.totalSpent,
                totalPurchases: c.totalPurchases,
            }));

        res.status(200).json({
            success: true,
            stats: {
                totalCustomers,
                activeCustomers,
                totalRevenue,
                topCustomers,
            },
        });
    } catch (error) {
        next(error);
    }
};
