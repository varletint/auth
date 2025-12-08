import { apiCall } from './api';

/**
 * Customer API endpoints
 */
export const customerApi = {
    /**
     * Get all customers with optional filters
     */
    getCustomers: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.search) queryParams.append('search', params.search);

        const queryString = queryParams.toString();
        return apiCall(`/customers${queryString ? `?${queryString}` : ''}`);
    },

    /**
     * Get a single customer
     */
    getCustomer: async (id) => {
        return apiCall(`/customers/${id}`);
    },

    /**
     * Create a new customer
     */
    createCustomer: async (customerData) => {
        return apiCall('/customers', {
            method: 'POST',
            body: JSON.stringify(customerData),
        });
    },

    /**
     * Update a customer
     */
    updateCustomer: async (id, customerData) => {
        return apiCall(`/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(customerData),
        });
    },

    /**
     * Delete a customer
     */
    deleteCustomer: async (id) => {
        return apiCall(`/customers/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Get customer stats
     */
    getStats: async () => {
        return apiCall('/customers/stats');
    },
};
