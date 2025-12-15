import React from "react";
import { Navigate } from "react-router-dom";
import useStaffStore from "../store/useStaffStore";

/**
 * Protected route component for staff members
 * Optionally checks for specific permissions
 */
export default function StaffProtectedRoute({ children, requiredPermissions = [] }) {
    const { isStaffAuthenticated, currentStaff, hasAnyPermission } = useStaffStore();

    // If not authenticated as staff, redirect to staff login
    if (!isStaffAuthenticated || !currentStaff) {
        return <Navigate to="/staff-login" replace />;
    }

    // If staff is not active, redirect to staff login
    if (!currentStaff.isActive) {
        return <Navigate to="/staff-login" replace />;
    }

    // If specific permissions are required, check them
    if (requiredPermissions.length > 0) {
        const hasPermission = hasAnyPermission(requiredPermissions);

        if (!hasPermission) {
            // Redirect to dashboard with limited access
            return <Navigate to="/biz-dashboard" replace />;
        }
    }

    return children;
}
