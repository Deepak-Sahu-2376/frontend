import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAdmin();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
