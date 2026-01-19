import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProtectedCompanyRoute = () => {
    const { user, isAuthenticated } = useUser();

    // Check if user is authenticated
    if (!isAuthenticated) {
        return <Navigate to="/company/login" replace />;
    }

    // Check if user has COMPANY_ADMIN role
    if (user?.userType !== 'COMPANY_ADMIN') {
        return <Navigate to="/company/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedCompanyRoute;
