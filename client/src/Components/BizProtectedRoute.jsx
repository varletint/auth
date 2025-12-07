import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

/**
 * Business Management Protected Route wrapper component
 * - Redirects to login if user is not authenticated
 * - Redirects to dashboard if user has a different appType
 */
export default function BizProtectedRoute({ children }) {
    const { currentUser } = useAuthStore();

    // Not logged in -> redirect to login
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Not a business_management user -> redirect to regular dashboard
    const isBusinessUser = currentUser?.appType === "business_management";
    if (!isBusinessUser) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
