import jwt from "jsonwebtoken";
import { errorHandler } from "../Utilis/errorHandler.js";
import User from "../Models/user.model.js";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, "Unauthorized"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
            return next(errorHandler(404, "User not found"));
        }
        next();
    } catch (err) {
        return next(errorHandler(403, "Forbidden"));
    }
};

export const verifySeller = (req, res, next) => {
    if (req.user && (req.user.role === "seller" || req.user.role === "admin")) {
        next();
    } else {
        return next(errorHandler(403, "Require Seller Role!"));
    }
};
