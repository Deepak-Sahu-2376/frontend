/**
 * Session Timeout Hook
 * Automatically logs out users after period of inactivity
 */

import { useEffect, useRef, useCallback } from 'react';

const SESSION_TIMEOUT = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 1800000; // 30 minutes default

export const useSessionTimeout = (onTimeout, timeout = SESSION_TIMEOUT) => {
    const timeoutId = useRef(null);

    const resetTimer = useCallback(() => {
        // Clear existing timeout
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        // Set new timeout
        timeoutId.current = setTimeout(() => {
            if (onTimeout) {
                onTimeout();
            }
        }, timeout);
    }, [onTimeout, timeout]);

    useEffect(() => {
        // Events that should reset the timer
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        // Reset timer on user activity
        const handleActivity = () => {
            resetTimer();
        };

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Initial timer setup
        resetTimer();

        // Cleanup
        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [resetTimer]);

    return resetTimer;
};
