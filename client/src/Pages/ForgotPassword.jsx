import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../Components/Input";
import Button from "../Components/Button";
import {
    Mail01Icon,
    SecurityValidationIcon,
    LockPasswordIcon,
    ArrowLeft01Icon,
    CheckmarkCircle02Icon,
} from "hugeicons-react";

// Validation schemas for each step
const emailSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
});

const otpSchema = yup.object({
    otp: yup
        .string()
        .required("OTP is required")
        .matches(/^[0-9]{6}$/, "OTP must be 6 digits"),
});

const passwordSchema = yup.object({
    newPassword: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export default function ForgotPassword() {
    document.title = "Forgot Password | Reset Your Password";
    const navigate = useNavigate();

    const [step, setStep] = useState(3); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [timeLeft, setTimeLeft] = useState(240); // 4 minutes in seconds
    const [isTimerActive, setIsTimerActive] = useState(false);

    // Form for current step
    const getSchema = () => {
        if (step === 1) return emailSchema;
        if (step === 2) return otpSchema;
        return passwordSchema;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(getSchema()),
    });

    // Auto-dismiss error after 3.5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 3500);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Countdown timer for OTP
    useEffect(() => {
        if (isTimerActive && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setIsTimerActive(false);
        }
    }, [isTimerActive, timeLeft]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Step 1: Request OTP
    const handleRequestOTP = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Failed to send OTP");
                return;
            }

            setEmail(data.email);
            setSuccess("OTP sent to your email!");
            setStep(2);
            setTimeLeft(240);
            setIsTimerActive(true);
            reset();
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: data.otp }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Invalid OTP");
                return;
            }

            setOtp(data.otp);
            setSuccess("OTP verified! Set your new password");
            setStep(3);
            reset();
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword: data.newPassword,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Failed to reset password");
                return;
            }

            setSuccess("Password reset successfully!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Failed to resend OTP");
                return;
            }

            setSuccess("New OTP sent to your email!");
            setTimeLeft(240);
            setIsTimerActive(true);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (data) => {
        if (step === 1) handleRequestOTP(data);
        else if (step === 2) handleVerifyOTP(data);
        else handleResetPassword(data);
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center bg-off-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20/30 blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-accent/20/30 blur-[100px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => (step === 1 ? navigate("/login") : step > 1 ? setStep(step - 1) : null)}
                            className="flex items-center gap-2 text-gray-600 hover:text-deep-black mb-4 transition-colors"
                        >
                            <ArrowLeft01Icon size={20} />
                            <span className="text-sm font-medium">Back</span>
                        </button>

                        <h1 className="text-3xl font-bold text-deep-black mb-2">
                            {step === 1 && "Forgot Password"}
                            {step === 2 && "Verify OTP"}
                            {step === 3 && "Set New Password"}
                        </h1>
                        <p className="text-gray-500">
                            {step === 1 && "Enter your email to receive an OTP"}
                            {step === 2 && "Enter the 6-digit code sent to your email"}
                            {step === 3 && "Create a strong password for your account"}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-between mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${s < step
                                        ? "bg-green-500 text-white"
                                        : s === step
                                            ? "bg-primary text-white"
                                            : "bg-gray-200 text-gray-400"
                                        }`}
                                >
                                    {s < step ? <CheckmarkCircle02Icon size={20} /> : s}
                                </div>
                                {s < 3 && (
                                    <div
                                        className={`h-1 flex-1 mx-2 transition-all ${s < step ? "bg-green-500" : "bg-gray-200"
                                            }`}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Step 1: Email Input */}
                        {step === 1 && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Mail01Icon size={18} className="text-gray-500" />
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                </div>
                                <Input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    id="email"
                                    {...register("email")}
                                    className={errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                            </div>
                        )}

                        {/* Step 2: OTP Input */}
                        {step === 2 && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <SecurityValidationIcon size={18} className="text-gray-500" />
                                    <label className="text-sm font-medium text-gray-700">Enter OTP</label>
                                </div>
                                <Input
                                    type="text"
                                    placeholder="000000"
                                    id="otp"
                                    maxLength="6"
                                    {...register("otp")}
                                    className={errors.otp ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}
                                />
                                {errors.otp && <p className="text-red-500 text-xs mt-1 ml-1">{errors.otp.message}</p>}

                                {/* Timer and Resend */}
                                <div className="flex items-center justify-between mt-3">
                                    <div className="text-sm text-gray-600">
                                        {isTimerActive ? (
                                            <span>
                                                Time remaining: <span className="font-bold text-cyan-accent">{formatTime(timeLeft)}</span>
                                            </span>
                                        ) : (
                                            <span className="text-red-600">OTP expired</span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={loading || (isTimerActive && timeLeft > 210)}
                                        className="text-sm font-medium text-cyan-accent hover:text-cyan-dark disabled:text-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <LockPasswordIcon size={18} className="text-gray-500" />
                                        <label className="text-sm font-medium text-gray-700">New Password</label>
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="Min 6 characters"
                                        id="newPassword"
                                        {...register("newPassword")}
                                        className={
                                            errors.newPassword ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
                                        }
                                    />
                                    {errors.newPassword && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.newPassword.message}</p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <LockPasswordIcon size={18} className="text-gray-500" />
                                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="Re-enter password"
                                        id="confirmPassword"
                                        {...register("confirmPassword")}
                                        className={
                                            errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
                                        }
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Error/Success Messages */}
                        {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}
                        {success && (
                            <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">{success}</div>
                        )}

                        {/* Submit Button */}
                        <Button
                            text={
                                loading
                                    ? step === 1
                                        ? "Sending OTP..."
                                        : step === 2
                                            ? "Verifying..."
                                            : "Resetting..."
                                    : step === 1
                                        ? "Send OTP"
                                        : step === 2
                                            ? "Verify OTP"
                                            : "Reset Password"
                            }
                            className={`bg-primary hover:bg-primary-dark w-full mt-2 ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            disabled={loading}
                        />
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Remember your password?{" "}
                        <Link to="/login" className="font-semibold text-cyan-accent hover:text-cyan-accent transition-colors">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


