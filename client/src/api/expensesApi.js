import { apiCall } from './api';

/**
 * Expenses API endpoints
 */
export const expensesApi = {
    /**
     * Get all expenses with optional filters
     */
    getExpenses: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.category) queryParams.append('category', params.category);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);

        const queryString = queryParams.toString();
        return apiCall(`/expenses${queryString ? `?${queryString}` : ''}`);
    },

    /**
     * Get a single expense
     */
    getExpense: async (id) => {
        return apiCall(`/expenses/${id}`);
    },

    /**
     * Create a new expense
     */
    createExpense: async (expenseData) => {
        return apiCall('/expenses', {
            method: 'POST',
            body: JSON.stringify(expenseData),
        });
    },

    /**
     * Update an expense
     */
    updateExpense: async (id, expenseData) => {
        return apiCall(`/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(expenseData),
        });
    },

    /**
     * Delete an expense
     */
    deleteExpense: async (id) => {
        return apiCall(`/expenses/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Get expense stats
     */
    getStats: async (period = 'month') => {
        return apiCall(`/expenses/stats?period=${period}`);
    },
};
