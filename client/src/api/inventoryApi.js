import { apiCall } from './api';

/**
 * Inventory API endpoints
 */
export const inventoryApi = {
    /**
     * Get all inventory items with optional filters
     */
    getItems: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.search) queryParams.append('search', params.search);
        if (params.category) queryParams.append('category', params.category);
        if (params.lowStock) queryParams.append('lowStock', params.lowStock);

        const queryString = queryParams.toString();
        return apiCall(`/inventory${queryString ? `?${queryString}` : ''}`);
    },

    /**
     * Get a single inventory item
     */
    getItem: async (id) => {
        return apiCall(`/inventory/${id}`);
    },

    /**
     * Create a new inventory item
     */
    createItem: async (itemData) => {
        return apiCall('/inventory', {
            method: 'POST',
            body: JSON.stringify(itemData),
        });
    },

    /**
     * Update an inventory item
     */
    updateItem: async (id, itemData) => {
        return apiCall(`/inventory/${id}`, {
            method: 'PUT',
            body: JSON.stringify(itemData),
        });
    },

    /**
     * Delete an inventory item
     */
    deleteItem: async (id) => {
        return apiCall(`/inventory/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Restock an inventory item
     */
    restockItem: async (id, restockData) => {
        return apiCall(`/inventory/${id}/restock`, {
            method: 'PATCH',
            body: JSON.stringify(restockData),
        });
    },

    /**
     * Get inventory stats
     */
    getStats: async () => {
        return apiCall('/inventory/stats');
    },
};
