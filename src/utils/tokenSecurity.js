/**
 * Token Security Utilities
 * - Token validation
 * - Token expiry checking
 * - Device fingerprinting
 */

/**
 * Decode JWT token (without verification - just for reading)
 */
export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Token decode error:', error);
        return null;
    }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
        return true;
    }

    const currentTime = Date.now() / 1000;
    // Add 5 minute buffer before actual expiry
    return decoded.exp < (currentTime + 300);
};

/**
 * Get token expiry time
 */
export const getTokenExpiry = (token) => {
    const decoded = decodeToken(token);
    return decoded?.exp ? new Date(decoded.exp * 1000) : null;
};

/**
 * Generate device fingerprint
 */
export const generateDeviceFingerprint = () => {
    const components = [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        !!window.sessionStorage,
        !!window.localStorage,
    ];

    const fingerprint = components.join('|');

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash).toString(36);
};

/**
 * Validate token fingerprint
 */
export const validateFingerprint = (storedFingerprint) => {
    const currentFingerprint = generateDeviceFingerprint();
    return storedFingerprint === currentFingerprint;
};

/**
 * Store token with fingerprint
 */
export const setTokenWithFingerprint = (tokenKey, token) => {
    const fingerprint = generateDeviceFingerprint();
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(`${tokenKey}_fp`, fingerprint);
    localStorage.setItem(`${tokenKey}_time`, Date.now().toString());
};

/**
 * Get token and validate fingerprint
 */
export const getValidatedToken = (tokenKey) => {
    const token = localStorage.getItem(tokenKey);
    const storedFingerprint = localStorage.getItem(`${tokenKey}_fp`);

    if (!token) {
        return null;
    }

    // Check fingerprint
    if (storedFingerprint && !validateFingerprint(storedFingerprint)) {
        console.warn('Token fingerprint mismatch - possible token theft');
        // Clear potentially stolen token
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(`${tokenKey}_fp`);
        localStorage.removeItem(`${tokenKey}_time`);
        return null;
    }

    // Check expiry
    if (isTokenExpired(token)) {
        console.warn('Token expired');
        return null;
    }

    return token;
};

/**
 * Clear token and related data
 */
export const clearToken = (tokenKey) => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(`${tokenKey}_fp`);
    localStorage.removeItem(`${tokenKey}_time`);
};

/**
 * XSS Protection - Sanitize token before storage
 * Ensures only valid JWT format is stored
 */
export const isValidJWTFormat = (token) => {
    if (typeof token !== 'string') return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Check each part is base64url
    const base64urlRegex = /^[A-Za-z0-9_-]+$/;
    return parts.every(part => base64urlRegex.test(part) && part.length > 0);
};
