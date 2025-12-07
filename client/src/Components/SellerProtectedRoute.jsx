import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

/**
 * Seller Protected Route wrapper component
 * - Redirects to login if user is not authenticated
 * - Redirects to become-seller if user is not a seller
 */
export default function SellerProtectedRoute({ children }) {
    const { currentUser } = useAuthStore();

    // Not logged in -> redirect to login
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but not a seller -> redirect to become-seller
    const isSeller = currentUser?.role?.includes("seller");
    if (!isSeller) {
        return <Navigate to="/become-seller" replace />;
    }

    return children;
}
