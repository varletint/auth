import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { staffApi } from "../api/staffApi";
import useStaffStore from "../store/useStaffStore";
import {
    UserIcon,
    LockPasswordIcon,
    Store01Icon,
    ArrowRight01Icon,
    Loading03Icon,
    Cancel01Icon,
    ShoppingBag01Icon,
} from "hugeicons-react";

export default function StaffLogin() {
    const navigate = useNavigate();
    const { staffSignIn } = useStaffStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        business_username: "",
        staff_name: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await staffApi.login(formData);
            staffSignIn(response.staff);
            navigate("/biz-dashboard");
        } catch (err) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Staff Login | Lookups</title>
                <meta name="description" content="Login as business staff member" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-emerald-600">
                            <ShoppingBag01Icon size={32} />
                            Lookups
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 mt-6">Staff Login</h1>
                        <p className="text-gray-500 mt-2">Sign in to access the business dashboard</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                                <Cancel01Icon size={20} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Business Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Business Username
                                </label>
                                <div className="relative">
                                    <Store01Icon
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        name="business_username"
                                        value={formData.business_username}
                                        onChange={handleChange}
                                        placeholder="Enter business username"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    The username of your business owner's account
                                </p>
                            </div>

                            {/* Staff Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Staff Name
                                </label>
                                <div className="relative">
                                    <UserIcon
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        name="staff_name"
                                        value={formData.staff_name}
                                        onChange={handleChange}
                                        placeholder="Enter your staff name"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <LockPasswordIcon
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loading03Icon size={20} className="animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight01Icon size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-sm text-gray-400">or</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* Links */}
                        <div className="text-center space-y-3">
                            <p className="text-sm text-gray-600">
                                Are you the business owner?{" "}
                                <Link to="/login" className="text-emerald-600 font-medium hover:underline">
                                    Login here
                                </Link>
                            </p>
                            <p className="text-sm text-gray-600">
                                New to Lookups?{" "}
                                <Link to="/register" className="text-emerald-600 font-medium hover:underline">
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Help Text */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Contact your business owner if you need login credentials
                    </p>
                </div>
            </div>
        </>
    );
}
