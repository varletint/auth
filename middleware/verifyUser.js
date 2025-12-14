import jwt from "jsonwebtoken";
import { errorHandler } from "../Utilis/errorHandler.js";
import User from "../Models/user.js";

export const verifyToken = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken && !refreshToken) {
        return next(errorHandler(401, "Unauthorized"));
    }

    try {
        // 1. Try to verify access token
        if (accessToken) {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");

            if (req.user) {
                return next();
            }
        }
    } catch (err) {
        // Access token expired or invalid, proceed to check refresh token
        // We don't return error here, we try refresh token
    }

    // 2. If access token failed/missing, try refresh token
    if (!refreshToken) {
        return next(errorHandler(401, "Unauthorized - Session expired"));
    }

    try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decodedRefresh.id).select("-password");

        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // 3. Issue new access token
        const newAccessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // 4. Set new access token cookie
        res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        req.user = user;
        next();

    } catch (err) {
        return next(errorHandler(403, "Forbidden - Invalid refresh token"));
    }
};

export const verifySeller = (req, res, next) => {
    // role is an array in the User model
    if (req.user && req.user.role && (req.user.role.includes("seller") || req.user.role.includes("admin"))) {
        next();
    } else {
        return next(errorHandler(403, "Require Seller Role!"));
    }
};

export const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role && req.user.role.includes("admin")) {
        next();
    } else {
        return next(errorHandler(403, "Admin access required"));
    }
};
