import jwt from "jsonwebtoken";
import { errorHandler } from "../Utilis/errorHandler.js";
import Staff from "../Models/staff.js";
import User from "../Models/user.js";

// ==================== Verify Staff Token ====================
export const verifyStaffToken = async (req, res, next) => {
    const accessToken = req.cookies.staff_access_token;
    const refreshToken = req.cookies.staff_refresh_token;

    if (!accessToken && !refreshToken) {
        return next(errorHandler(401, "Staff authentication required"));
    }

    try {
        // Try to verify access token
        if (accessToken) {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

            if (!decoded.isStaff) {
                return next(errorHandler(401, "Invalid staff token"));
            }

            const staff = await Staff.findById(decoded.id).select("-password");

            if (!staff) {
                return next(errorHandler(404, "Staff member not found"));
            }

            if (!staff.isActive) {
                return next(errorHandler(403, "Staff account is deactivated"));
            }

            req.staff = staff;
            req.staffPermissions = staff.permissions;
            return next();
        }
    } catch (err) {
        // Access token expired or invalid, try refresh token
    }

    // Try refresh token
    if (!refreshToken) {
        return next(errorHandler(401, "Staff session expired"));
    }

    try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_SECRET);

        if (!decodedRefresh.isStaff) {
            return next(errorHandler(401, "Invalid staff refresh token"));
        }

        const staff = await Staff.findById(decodedRefresh.id).select("-password");

        if (!staff) {
            return next(errorHandler(404, "Staff member not found"));
        }

        if (!staff.isActive) {
            return next(errorHandler(403, "Staff account is deactivated"));
        }

        // Issue new access token
        const newAccessToken = jwt.sign(
            {
                id: staff._id,
                staffId: staff._id,
                businessOwner: staff.businessOwner,
                role: staff.role,
                permissions: staff.permissions,
                isStaff: true,
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        // Set new access token cookie
        res.cookie("staff_access_token", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 8 * 60 * 60 * 1000,
        });

        req.staff = staff;
        req.staffPermissions = staff.permissions;
        next();
    } catch (err) {
        return next(errorHandler(403, "Invalid staff refresh token"));
    }
};

// ==================== Verify Business Owner ====================
export const verifyBusinessOwner = (req, res, next) => {
    if (!req.user) {
        return next(errorHandler(401, "Authentication required"));
    }

    if (req.user.appType !== "business_management") {
        return next(errorHandler(403, "Business management account required"));
    }

    next();
};

// ==================== Verify Staff Permission ====================
export const verifyStaffPermission = (...requiredPermissions) => {
    return (req, res, next) => {
        if (!req.staff && !req.user) {
            return next(errorHandler(401, "Authentication required"));
        }

        // If business owner, allow all permissions
        if (req.user && req.user.appType === "business_management") {
            return next();
        }

        // Check staff permissions
        if (req.staff) {
            const hasPermission = requiredPermissions.some((permission) =>
                req.staff.permissions.includes(permission)
            );

            if (!hasPermission) {
                return next(errorHandler(403, "You don't have permission to perform this action"));
            }
        }

        next();
    };
};

// ==================== Verify Either Business Owner or Staff ====================
export const verifyBusinessOrStaff = async (req, res, next) => {
    // Try business owner token first
    const accessToken = req.cookies.access_token;
    const staffAccessToken = req.cookies.staff_access_token;

    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");

            if (user && user.appType === "business_management") {
                req.user = user;
                req.isBusinessOwner = true;
                req.businessOwnerId = user._id; // Unified ID for controllers
                return next();
            }
        } catch (err) {
            // Token invalid, try staff token
        }
    }

    if (staffAccessToken) {
        try {
            const decoded = jwt.verify(staffAccessToken, process.env.JWT_SECRET);

            if (decoded.isStaff) {
                const staff = await Staff.findById(decoded.id).select("-password");

                if (staff && staff.isActive) {
                    req.staff = staff;
                    req.isStaff = true;
                    req.staffPermissions = staff.permissions;
                    req.businessOwnerId = staff.businessOwner; // Staff's business owner ID
                    // Set req.user with an id property for backward compatibility with controllers
                    req.user = { id: staff.businessOwner, _id: staff.businessOwner };
                    return next();
                }
            }
        } catch (err) {
            // Token invalid
        }
    }

    return next(errorHandler(401, "Authentication required"));
};
