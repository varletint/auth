import Staff from "../Models/staff.js";
import User from "../Models/user.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { errorHandler } from "../Utilis/errorHandler.js";

// ==================== Register Staff (Business Owner Only) ====================
export const registerStaff = async (req, res, next) => {
    try {
        const { staff_name, password, role, permissions } = req.body;
        const businessOwnerId = req.user.id;

        // Validate required fields
        if (!staff_name || !password) {
            return next(errorHandler(400, "Staff name and password are required"));
        }

        if (password.length < 6) {
            return next(errorHandler(400, "Password must be at least 6 characters"));
        }

        // Check if user is a business owner
        if (req.user.appType !== "business_management") {
            return next(errorHandler(403, "Only business management accounts can register staff"));
        }

        // Check if staff name already exists for this business
        const existingStaff = await Staff.findOne({
            businessOwner: businessOwnerId,
            staff_name: staff_name.toLowerCase().trim(),
        });

        if (existingStaff) {
            return next(errorHandler(400, "A staff member with this name already exists"));
        }

        // Hash password
        const hashedPassword = await argon2.hash(password);

        // Get default permissions if not provided
        const staffPermissions = permissions && permissions.length > 0
            ? permissions
            : Staff.getDefaultPermissions(role || "cashier");

        // Create new staff
        const newStaff = new Staff({
            businessOwner: businessOwnerId,
            staff_name: staff_name.toLowerCase().trim(),
            password: hashedPassword,
            role: role || "cashier",
            permissions: staffPermissions,
        });

        await newStaff.save();

        // Remove password from response
        const { password: pass, ...staffData } = newStaff._doc;

        res.status(201).json({
            success: true,
            message: "Staff member registered successfully",
            staff: staffData,
        });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return next(errorHandler(400, "A staff member with this name already exists"));
        }
        next(error);
    }
};

// ==================== Staff Login ====================
export const staffLogin = async (req, res, next) => {
    try {
        const { staff_name, password, business_username } = req.body;

        // Validate required fields
        if (!staff_name || !password || !business_username) {
            return next(errorHandler(400, "Staff name, password, and business username are required"));
        }

        // Find the business owner
        const businessOwner = await User.findOne({
            username: business_username.toLowerCase().trim(),
            appType: "business_management",
        });

        if (!businessOwner) {
            return next(errorHandler(404, "Business not found"));
        }

        // Find staff member
        const staff = await Staff.findOne({
            businessOwner: businessOwner._id,
            staff_name: staff_name.toLowerCase().trim(),
        }).select("+password");

        if (!staff) {
            return next(errorHandler(404, "Staff member not found"));
        }

        // Check if staff is active
        if (!staff.isActive) {
            return next(errorHandler(403, "This staff account has been deactivated"));
        }

        // Check if account is locked
        if (staff.accountLockedUntil && staff.accountLockedUntil > Date.now()) {
            return next(errorHandler(403, "Account is temporarily locked. Please try again later."));
        }

        // Verify password
        const validPassword = await argon2.verify(staff.password, password);
        if (!validPassword) {
            await staff.incrementFailedLogins();
            return next(errorHandler(401, "Invalid credentials"));
        }

        // Reset failed login attempts
        await staff.resetFailedLogins();
        staff.lastLogin = Date.now();
        await staff.save();

        // Generate tokens
        const accessToken = jwt.sign(
            {
                id: staff._id,
                staffId: staff._id,
                businessOwner: businessOwner._id,
                role: staff.role,
                permissions: staff.permissions,
                isStaff: true,
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" } // Staff tokens last for work shift
        );

        const refreshToken = jwt.sign(
            { id: staff._id, isStaff: true },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Remove password from response
        const { password: pass, ...staffData } = staff._doc;

        res
            .cookie("staff_access_token", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 8 * 60 * 60 * 1000, // 8 hours
            })
            .cookie("staff_refresh_token", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .status(200)
            .json({
                success: true,
                message: "Login successful",
                staff: {
                    ...staffData,
                    businessName: businessOwner.username,
                },
            });
    } catch (error) {
        next(error);
    }
};

// ==================== Staff Logout ====================
export const staffLogout = async (req, res, next) => {
    try {
        res.clearCookie("staff_access_token");
        res.clearCookie("staff_refresh_token");
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};

// ==================== Get All Staff (Business Owner Only) ====================
export const getAllStaff = async (req, res, next) => {
    try {
        const businessOwnerId = req.user.id;

        const staff = await Staff.find({ businessOwner: businessOwnerId })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: staff.length,
            staff,
        });
    } catch (error) {
        next(error);
    }
};

// ==================== Get Staff By ID ====================
export const getStaffById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const businessOwnerId = req.user.id;

        const staff = await Staff.findOne({
            _id: id,
            businessOwner: businessOwnerId,
        }).select("-password");

        if (!staff) {
            return next(errorHandler(404, "Staff member not found"));
        }

        res.status(200).json({
            success: true,
            staff,
        });
    } catch (error) {
        next(error);
    }
};

// ==================== Update Staff ====================
export const updateStaff = async (req, res, next) => {
    try {
        const { id } = req.params;
        const businessOwnerId = req.user.id;
        const { staff_name, role, permissions, isActive, password } = req.body;

        // Find staff
        const staff = await Staff.findOne({
            _id: id,
            businessOwner: businessOwnerId,
        });

        if (!staff) {
            return next(errorHandler(404, "Staff member not found"));
        }

        // Update fields
        if (staff_name) {
            // Check if new name already exists
            const existingStaff = await Staff.findOne({
                businessOwner: businessOwnerId,
                staff_name: staff_name.toLowerCase().trim(),
                _id: { $ne: id },
            });

            if (existingStaff) {
                return next(errorHandler(400, "A staff member with this name already exists"));
            }

            staff.staff_name = staff_name.toLowerCase().trim();
        }

        if (role) {
            staff.role = role;
            // Update permissions to default for new role if not explicitly provided
            if (!permissions) {
                staff.permissions = Staff.getDefaultPermissions(role);
            }
        }

        if (permissions) {
            staff.permissions = permissions;
        }

        if (typeof isActive === "boolean") {
            staff.isActive = isActive;
        }

        // Update password if provided
        if (password) {
            if (password.length < 6) {
                return next(errorHandler(400, "Password must be at least 6 characters"));
            }
            staff.password = await argon2.hash(password);
        }

        await staff.save();

        // Remove password from response
        const { password: pass, ...staffData } = staff._doc;

        res.status(200).json({
            success: true,
            message: "Staff member updated successfully",
            staff: staffData,
        });
    } catch (error) {
        if (error.code === 11000) {
            return next(errorHandler(400, "A staff member with this name already exists"));
        }
        next(error);
    }
};

// ==================== Delete Staff ====================
export const deleteStaff = async (req, res, next) => {
    try {
        const { id } = req.params;
        const businessOwnerId = req.user.id;

        const staff = await Staff.findOneAndDelete({
            _id: id,
            businessOwner: businessOwnerId,
        });

        if (!staff) {
            return next(errorHandler(404, "Staff member not found"));
        }

        res.status(200).json({
            success: true,
            message: "Staff member deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// ==================== Get Current Staff (for logged-in staff) ====================
export const getCurrentStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.staff.id).select("-password");

        if (!staff) {
            return next(errorHandler(404, "Staff member not found"));
        }

        // Get business owner info
        const businessOwner = await User.findById(staff.businessOwner).select("username");

        res.status(200).json({
            success: true,
            staff: {
                ...staff._doc,
                businessName: businessOwner?.username,
            },
        });
    } catch (error) {
        next(error);
    }
};
