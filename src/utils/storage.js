/**
 * Storage Utilities
 * Safely store and retrieve data from localStorage
 */

import {
    setTokenWithFingerprint,
    getValidatedToken,
    clearToken,
    isValidJWTFormat
} from './tokenSecurity.js';

/**
 * Sanitize user data before storing
 * Removes sensitive information
 */
export const sanitizeUserDataForStorage = (userData) => {
    if (!userData || typeof userData !== 'object') {
        return null;
    }

    // Only store non-sensitive data
    return {
        id: userData.id || userData.userId,
        name: userData.name,
        userType: userData.userType,
        companyId: userData.companyId,
        // Do NOT store: passwords, tokens, email, phone, documents, etc.
        // These should be fetched from API when needed
    };
};

/**
 * Safely get item from localStorage
 */
export const getStorageItem = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
};

/**
 * Safely set item in localStorage
 */
export const setStorageItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
    }
};

/**
 * Safely remove item from localStorage
 */
export const removeStorageItem = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
};

/**
 * Securely store authentication token with fingerprinting
 */
export const setSecureToken = (tokenKey, token) => {
    if (!isValidJWTFormat(token)) {
        console.error('Invalid token format - possible XSS attempt');
        return false;
    }

    setTokenWithFingerprint(tokenKey, token);
    return true;
};

/**
 * Retrieve and validate authentication token
 */
export const getSecureToken = (tokenKey) => {
    return getValidatedToken(tokenKey);
};

/**
 * Remove token securely
 */
export const removeSecureToken = (tokenKey) => {
    clearToken(tokenKey);
};

/**
 * Clear all application storage
 */
export const clearAppStorage = () => {
    try {
        const keysToRemove = [
            'brickbroker_user',
            'brickbroker_favorites',
            'accessToken',
            'accessToken_fp',
            'accessToken_time',
            'adminAccessToken',
            'adminAccessToken_fp',
            'adminAccessToken_time',
            'admin_auth',
            'adminUserId',
        ];

        keysToRemove.forEach(key => localStorage.removeItem(key));
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
};

// Re-export token security utilities
export {
    setTokenWithFingerprint,
    getValidatedToken,
    clearToken,
    isValidJWTFormat,
    decodeToken,
    isTokenExpired,
    getTokenExpiry
} from './tokenSecurity.js';
