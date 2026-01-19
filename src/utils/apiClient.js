/**
 * Centralized API Client with Security Features
 * - Request timeout
 * - Response validation
 * - Error handling
 * - CSRF protection ready
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Fetch with timeout
 */
const fetchWithTimeout = async (url, options = {}, timeout = DEFAULT_TIMEOUT) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new ApiError('Request timeout', 408, null);
        }
        throw error;
    }
};

/**
 * Validate API response structure
 */
const validateResponse = (data) => {
    if (!data || typeof data !== 'object') {
        throw new ApiError('Invalid response format', 500, null);
    }
    return true;
};

/**
 * Build headers with authentication
 */
const buildHeaders = (customHeaders = {}, tokenKey = 'accessToken') => {
    const token = localStorage.getItem(tokenKey);
    const headers = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // CSRF token support (when backend implements it)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
    }

    return headers;
};

/**
 * Main API request function
 */
export const apiRequest = async (endpoint, options = {}) => {
    const {
        method = 'GET',
        body = null,
        headers = {},
        tokenKey = 'accessToken',
        timeout = DEFAULT_TIMEOUT,
        validateResult = true,
    } = options;

    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = {
        method,
        headers: buildHeaders(headers, tokenKey),
    };

    if (body) {
        requestOptions.body = JSON.stringify(body);
    }

    try {
        const response = await fetchWithTimeout(url, requestOptions, timeout);
        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                data.message || data.error || 'Request failed',
                response.status,
                data
            );
        }

        if (validateResult) {
            validateResponse(data);
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Network or parsing error
        console.error('API Request Error:', error);
        throw new ApiError('Network error occurred', 0, null);
    }
};

/**
 * Convenience methods
 */
export const api = {
    get: (endpoint, options = {}) =>
        apiRequest(endpoint, { ...options, method: 'GET' }),

    post: (endpoint, body, options = {}) =>
        apiRequest(endpoint, { ...options, method: 'POST', body }),

    put: (endpoint, body, options = {}) =>
        apiRequest(endpoint, { ...options, method: 'PUT', body }),

    delete: (endpoint, options = {}) =>
        apiRequest(endpoint, { ...options, method: 'DELETE' }),

    patch: (endpoint, body, options = {}) =>
        apiRequest(endpoint, { ...options, method: 'PATCH', body }),
};

export { API_BASE_URL, ApiError };
