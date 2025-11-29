import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

/**
 * Protected Route wrapper component
 * Redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ children }) {
    const { currentUser } = useAuthStore();

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
