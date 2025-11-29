import express from "express";
import * as authController from "../controller/authController.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

// Specific routes with middleware
router.put("/updateProfile", verifyToken, authController.updateProfile);

// Map of allowed operations and their HTTP methods
const authOperations = {
    signup: { method: 'post', handler: 'signup' },
    signin: { method: 'post', handler: 'signin' },
    signout: { method: 'get', handler: 'signout' }
};

// Dynamic route handler
router.all("/:operation", (req, res, next) => {
    const { operation } = req.params;

    // Validate if the operation exists and method matches
    const authOp = authOperations[operation];

    if (!authOp) {
        return res.status(404).json({
            success: false,
            message: `Auth operation '${operation}' not found`
        });
    }

    // Check if the HTTP method matches
    if (req.method.toLowerCase() !== authOp.method) {
        return res.status(405).json({
            success: false,
            message: `Method ${req.method} not allowed for ${operation}. Use ${authOp.method.toUpperCase()}`
        });
    }

    // Call the appropriate controller function
    const handler = authController[authOp.handler];
    if (handler) {
        return handler(req, res, next);
    }

    res.status(500).json({
        success: false,
        message: 'Handler not found'
    });
});

// Keep static routes as fallback/alternative (optional - you can remove these if you want fully dynamic)
// router.post("/signup", authController.signup);
// router.post("/signin", authController.signin);
// router.get("/signout", authController.signout);

export default router;
