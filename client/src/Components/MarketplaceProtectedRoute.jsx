import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

/**
 * MarketplaceProtectedRoute - Redirects business_management users to BizDashboard
 * Use this to wrap marketplace routes that should not be accessible to business users
 */
export default function MarketplaceProtectedRoute({ children }) {
    const { currentUser, loading } = useAuthStore();

    // If still loading auth state, don't redirect yet
    if (loading) {
        return null;
    }

    // If user is logged in and has business_management appType, redirect to biz dashboard
    if (currentUser && currentUser.appType === "business_management") {
        return <Navigate to="/biz-dashboard" replace />;
    }

    // Otherwise, render the children (marketplace content)
    return children;
}
