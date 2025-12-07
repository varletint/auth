/**
 * Order API functions
 */

import { apiCall } from "./api.js";

/**
 * Create a new order for a product
 */
export const createOrder = async (productId, quantity = 1, buyerNotes = "") => {
    return apiCall(`/orders/${productId}`, {
        method: "POST",
        body: JSON.stringify({ quantity, buyerNotes }),
    });
};

/**
 * Get buyer's orders (My Orders)
 */
export const getMyOrders = async (status = null, page = 1, limit = 10) => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append("status", status);
    return apiCall(`/orders/my-orders?${params.toString()}`, {
        method: "GET",
    });
};

/**
 * Get seller's incoming orders
 */
export const getSellerOrders = async (status = null, page = 1, limit = 10) => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append("status", status);
    return apiCall(`/orders/seller-orders?${params.toString()}`, {
        method: "GET",
    });
};

/**
 * Update order status (Seller only)
 */
export const updateOrderStatus = async (orderId, status, sellerNotes = "") => {
    return apiCall(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, sellerNotes }),
    });
};

/**
 * Get single order details
 */
export const getOrderById = async (orderId) => {
    return apiCall(`/orders/${orderId}`, {
        method: "GET",
    });
};
