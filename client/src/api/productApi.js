import { apiCall } from './api';

/**
 * Product API endpoints
 */

export const productApi = {
    /**
     * Get all products with optional filters
     * @param {Object} params - Query parameters (page, limit, category, etc.)
     */
    getProducts: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/products${queryString ? `?${queryString}` : ''}`;
        return apiCall(url, { method: 'GET' });
    },

    /**
     * Get single product by ID
     */
    getProduct: async (id) => {
        return apiCall(`/products/${id}`, { method: 'GET' });
    },

    /**
     * Create a new product
     * @param {Object} productData - Product data with image URLs
     */
    createProduct: async (productData) => {
        return apiCall('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    },

    /**
     * Update existing product
     */
    updateProduct: async (id, productData) => {
        return apiCall(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    },

    /**
     * Delete product
     */
    deleteProduct: async (id) => {
        return apiCall(`/products/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Restock a product (Seller only)
     * @param {string} id - Product ID
     * @param {number} quantity - Quantity to add
     * @param {string} reason - Optional reason for restock
     */
    restockProduct: async (id, quantity, reason = '') => {
        return apiCall(`/products/${id}/restock`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity, reason }),
        });
    },

    /**
     * Get product transaction history (Seller only)
     * @param {string} id - Product ID
     * @param {Object} params - Query params (page, limit, type)
     */
    getTransactionHistory: async (id, params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/products/${id}/transactions${queryString ? `?${queryString}` : ''}`;
        return apiCall(url, { method: 'GET' });
    },
};
