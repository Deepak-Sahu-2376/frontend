/**
 * Input Sanitization Utilities
 * Protects against XSS and validates user input
 */

import DOMPurify from 'dompurify';
import validator from 'validator';

/**
 * Sanitize text input to prevent XSS
 */
export const sanitizeText = (input) => {
    if (typeof input !== 'string') return '';
    return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [] });
};

/**
 * Sanitize HTML content (when needed)
 */
export const sanitizeHtml = (input) => {
    if (typeof input !== 'string') return '';
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'target'],
    });
};

/**
 * Validate and sanitize email
 */
export const sanitizeEmail = (email) => {
    const sanitized = sanitizeText(email);
    return validator.isEmail(sanitized) ? sanitized.toLowerCase() : '';
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
    return validator.isEmail(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone) => {
    // Basic phone validation - adjust regex based on your requirements
    return validator.isMobilePhone(phone, 'any') || /^[0-9]{10}$/.test(phone);
};

/**
 * Sanitize phone number
 */
export const sanitizePhone = (phone) => {
    // Remove all non-numeric characters
    return phone.replace(/\D/g, '');
};

/**
 * Validate URL
 */
export const isValidUrl = (url) => {
    return validator.isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true,
    });
};

/**
 * Sanitize numeric input
 */
export const sanitizeNumber = (input) => {
    const num = parseFloat(input);
    return isNaN(num) ? 0 : num;
};

/**
 * Sanitize object (recursively sanitize all string values)
 */
export const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    const sanitized = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            if (typeof value === 'string') {
                sanitized[key] = sanitizeText(value);
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }
    }

    return sanitized;
};

/**
 * Sanitize form data
 */
export const sanitizeFormData = (formData) => {
    const sanitized = {};

    for (const [key, value] of Object.entries(formData)) {
        if (typeof value === 'string') {
            // Special handling for specific fields
            if (key.toLowerCase().includes('email')) {
                sanitized[key] = sanitizeEmail(value);
            } else if (key.toLowerCase().includes('phone')) {
                sanitized[key] = sanitizePhone(value);
            } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('link')) {
                sanitized[key] = sanitizeText(value);
            } else {
                sanitized[key] = sanitizeText(value);
            }
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
        isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
    };
};
