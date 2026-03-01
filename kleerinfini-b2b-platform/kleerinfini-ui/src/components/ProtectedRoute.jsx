import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role-based protection
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn(`Access denied for role: ${user.role}. Allowed: ${allowedRoles}`);

        // Redirect based on actual role
        if (user.role === 'producer') return <Navigate to="/producer-dashboard" replace />;
        if (user.role === 'client') return <Navigate to="/dashboard" replace />;
        if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;

        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
