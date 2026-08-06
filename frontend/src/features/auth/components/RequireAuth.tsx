import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

/**
 * Wraps protected routes. Redirects to /login when the user is not authenticated.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
