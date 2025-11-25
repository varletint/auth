import express from "express";
import { requestOTP, verifyOTP, resetPassword } from "../controller/forgotPasswordController.js";

const router = express.Router();

// Request OTP for password reset
router.post("/forgot-password", requestOTP);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Reset password
router.post("/reset-password", resetPassword);

export default router;
