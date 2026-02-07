import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../utils/apiClient';
import { useUser } from './UserContext';

const SocketContext = createContext(undefined);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [activeUsers, setActiveUsers] = useState(0);
    const { user, isAuthenticated } = useUser();

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(API_BASE_URL);

        setSocket(newSocket);

        // Listen for active user count updates (publicly available in this implementation, but logic ensures only admin sees it in UI if we want stricter control we can do it backend side which we did)
        // Actually, the backend emits to 'admin' room only. So we need to join that room.

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const joinAdminRoom = useCallback((token) => {
        if (socket) {
            socket.emit('joinAdmin', token);

            // Remove existing listener before adding new one to avoid duplicates
            socket.off('activeUsers');
            socket.on('activeUsers', (count) => {
                setActiveUsers(count);
            });
        }
    }, [socket]);

    // Clean up listener on unmount
    useEffect(() => {
        return () => {
            if (socket) {
                socket.off('activeUsers');
            }
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, activeUsers, joinAdminRoom }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
