import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. Loading State OR Undefined Role Protection: NO REDIRECTION until handshake is DEFINITIVE
    // If we have a user from localStorage but the profile/me call hasn't finished merging the role, STAY PUT.
    if (loading || (user && !user.role)) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    // 2. Unauthenticated check (only after we're sure loading is false and user is null)
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. EXTREME BARRIERS (As requested by USER)
    const isProducerPath = location.pathname.startsWith('/producer-dashboard');
    const isClientPath = location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/producer-dashboard');

    // Barrier A: Unauthorized Client on Producer Path
    if (isProducerPath && user.role !== 'producer' && user.role !== 'admin') {
        console.warn(`[Barrier] Client ${user.role} on Producer Path. Redirecting back to /dashboard`);
        // If they don't have a role but tried to go to producer path, assume they might be a producer with a corrupted state,
        // so kick them to login instead of client dashboard to be safe.
        if (!user.role) return <Navigate to="/login" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    // Barrier B: Unauthorized Producer on Client Path
    if (isClientPath && user.role !== 'client' && user.role !== 'admin') {
        console.warn(`[Barrier] Producer ${user.role} on Client Path. Redirecting back to /producer-dashboard`);
        if (!user.role) return <Navigate to="/login" replace />;
        return <Navigate to="/producer-dashboard" replace />;
    }

    // 4. Manual allowedRoles check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn(`[Barrier] Role ${user.role} not in allowedRoles: ${allowedRoles}`);
        if (user.role === 'producer') return <Navigate to="/producer-dashboard" replace />;
        if (user.role === 'client') return <Navigate to="/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
