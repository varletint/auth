import { apiCall } from './api';

/**
 * Sales API endpoints
 */
export const salesApi = {
    /**
     * Get all sales with optional filters
     */
    getSales: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.customer) queryParams.append('customer', params.customer);
        if (params.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);

        const queryString = queryParams.toString();
        return apiCall(`/sales${queryString ? `?${queryString}` : ''}`);
    },

    /**
     * Get a single sale
     */
    getSale: async (id) => {
        return apiCall(`/sales/${id}`);
    },

    /**
     * Create a new sale
     */
    createSale: async (saleData) => {
        return apiCall('/sales', {
            method: 'POST',
            body: JSON.stringify(saleData),
        });
    },

    /**
     * Update a sale
     */
    updateSale: async (id, saleData) => {
        return apiCall(`/sales/${id}`, {
            method: 'PUT',
            body: JSON.stringify(saleData),
        });
    },

    /**
     * Delete a sale
     */
    deleteSale: async (id) => {
        return apiCall(`/sales/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Get sales stats
     */
    getStats: async (period = 'today') => {
        return apiCall(`/sales/stats?period=${period}`);
    },
};
