/**
 * Staff API client for business management
 */
import { apiCall } from './api';

export const staffApi = {
    // ==================== Business Owner Operations ====================

    /**
     * Register a new staff member (business owner only)
     */
    register: async (data) => {
        return apiCall('/staff/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Get all staff members for the business
     */
    getAll: async () => {
        return apiCall('/staff', {
            method: 'GET',
        });
    },

    /**
     * Get a single staff member by ID
     */
    getById: async (id) => {
        return apiCall(`/staff/${id}`, {
            method: 'GET',
        });
    },

    /**
     * Update a staff member
     */
    update: async (id, data) => {
        return apiCall(`/staff/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Delete a staff member
     */
    delete: async (id) => {
        return apiCall(`/staff/${id}`, {
            method: 'DELETE',
        });
    },

    // ==================== Staff Operations ====================

    /**
     * Staff login
     */
    login: async (data) => {
        return apiCall('/staff/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Staff logout
     */
    logout: async () => {
        return apiCall('/staff/logout', {
            method: 'POST',
        });
    },

    /**
     * Get current logged-in staff info
     */
    getCurrentStaff: async () => {
        return apiCall('/staff/me', {
            method: 'GET',
        });
    },
};
