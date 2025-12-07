import { apiCall } from './api';

/**
 * Cart API endpoints
 */

export const cartApi = {
    /**
     * Get user's cart
     */
    getCart: async () => {
        return apiCall('/cart', { method: 'GET' });
    },

    /**
     * Add product to cart
     * @param {string} productId - Product ID to add
     * @param {number} quantity - Quantity to add (default 1)
     */
    addToCart: async (productId, quantity = 1) => {
        return apiCall(`/cart/${productId}`, {
            method: 'POST',
            body: JSON.stringify({ quantity }),
        });
    },

    /**
     * Update cart item quantity
     * @param {string} productId - Product ID to update
     * @param {number} quantity - New quantity
     */
    updateQuantity: async (productId, quantity) => {
        return apiCall(`/cart/${productId}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
        });
    },

    /**
     * Remove product from cart
     * @param {string} productId - Product ID to remove
     */
    removeFromCart: async (productId) => {
        return apiCall(`/cart/${productId}`, { method: 'DELETE' });
    },

    /**
     * Clear entire cart
     */
    clearCart: async () => {
        return apiCall('/cart', { method: 'DELETE' });
    },
};
