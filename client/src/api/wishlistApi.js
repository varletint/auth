import { apiCall } from './api';

/**
 * Wishlist API endpoints
 */

export const wishlistApi = {
    /**
     * Get user's wishlist
     */
    getWishlist: async () => {
        return apiCall('/wishlist', { method: 'GET' });
    },

    /**
     * Add product to wishlist
     * @param {string} productId - Product ID to add
     */
    addToWishlist: async (productId) => {
        return apiCall(`/wishlist/${productId}`, { method: 'POST' });
    },

    /**
     * Remove product from wishlist
     * @param {string} productId - Product ID to remove
     */
    removeFromWishlist: async (productId) => {
        return apiCall(`/wishlist/${productId}`, { method: 'DELETE' });
    },

    /**
     * Check if product is in wishlist
     * @param {string} productId - Product ID to check
     */
    checkWishlistItem: async (productId) => {
        return apiCall(`/wishlist/check/${productId}`, { method: 'GET' });
    },
};
