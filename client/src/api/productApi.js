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
};
