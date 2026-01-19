/**
 * Rate Limiting Utilities
 * Debounce and throttle functions to prevent excessive calls
 */

/**
 * Debounce function - delays execution until after wait time has elapsed
 * since the last call
 */
export const debounce = (func, wait = 300) => {
    let timeoutId;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeoutId);
            func(...args);
        };

        clearTimeout(timeoutId);
        timeoutId = setTimeout(later, wait);
    };
};

/**
 * Throttle function - ensures function is called at most once per wait period
 */
export const throttle = (func, wait = 300) => {
    let inThrottle;

    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), wait);
        }
    };
};

/**
 * React hook for debouncing values
 */
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * React hook for debouncing callbacks
 */
import { useCallback, useRef } from 'react';

export const useDebouncedCallback = (callback, delay = 300) => {
    const timeoutRef = useRef(null);

    return useCallback(
        (...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
};
