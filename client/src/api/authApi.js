import { apiCall } from './api';

/**
 * Auth API endpoints
 */

export const authApi = {
    /**
     * Sign up a new user
     */
    signup: async (userData) => {
        return apiCall('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    /**
     * Sign in existing user
     */
    signin: async (credentials) => {
        return apiCall('/auth/signin', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    /**
     * Sign out current user
     */
    signout: async () => {
        return apiCall('/auth/signout', {
            method: 'GET',
        });
    },

    /**
     * Update user profile
     */
    updateProfile: async (userData) => {
        return apiCall('/auth/updateProfile', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },
};
