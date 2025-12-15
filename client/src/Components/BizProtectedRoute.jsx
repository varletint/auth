import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useStaffStore from '../store/useStaffStore';

/**
 * Business Management Protected Route wrapper component
 * - Allows access if user is a business owner OR an authenticated staff member
 * - Redirects to appropriate login page if not authenticated
 */
export default function BizProtectedRoute({ children }) {
    const { currentUser } = useAuthStore();
    const { isStaffAuthenticated } = useStaffStore();

    // Check if user is a business owner
    const isBusinessOwner = currentUser?.appType === "business_management";

    // Allow access if either business owner OR authenticated staff
    if (isBusinessOwner || isStaffAuthenticated) {
        return children;
    }

    // If regular user (marketplace), redirect to their dashboard
    if (currentUser && !isBusinessOwner) {
        return <Navigate to="/dashboard" replace />;
    }

    // Not logged in at all -> redirect to login
    return <Navigate to="/login" replace />;
}
