/**
 * Centralized API utility for making HTTP requests
 */

// Use environment variable for production, fallback to /api for local dev with proxy
const BASE_URL = `${import.meta.env.VITE_API_URL}/api` || '/api';

class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';
    }
}

/**
 * Generic fetch wrapper with error handling
 */
const apiCall = async (url, options = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            ...options,
            credentials: 'include', // Include cookies for authentication
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                data.message || 'Request failed',
                response.status,
                data
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(error.message || 'Network error', 500);
    }
};

/**
 * API call for file uploads (multipart/form-data)
 */
const apiUpload = async (url, formData, options = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            body: formData,
            credentials: 'include', // Include cookies for authentication
            ...options,
            // Don't set Content-Type for FormData - browser will set it with boundary
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                data.message || 'Upload failed',
                response.status,
                data
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(error.message || 'Network error', 500);
    }
};

export { apiCall, apiUpload, ApiError };
