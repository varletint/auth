import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import Input from "../Components/Input";
import useAuthStore from "../store/useAuthStore";
import { apiCall } from "../api/api";
import {
    Store04Icon,
    CheckmarkCircle02Icon,
    Loading03Icon,
    ArrowRight01Icon,
} from "hugeicons-react";

export default function BecomeSeller() {
    const navigate = useNavigate();
    const { currentUser, updateUser } = useAuthStore();
    const [formData, setFormData] = useState({
        reason: "",
        businessName: "",
    });
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isSeller, setIsSeller] = useState(false);

    // Check if user is already a seller
    useEffect(() => {
        const checkSellerStatus = async () => {
            try {
                const response = await apiCall("/seller-application/status", { method: "GET" });
                if (response.isSeller) {
                    setIsSeller(true);
                }
            } catch (err) {
                console.error("Error checking seller status:", err);
            } finally {
                setCheckingStatus(false);
            }
        };

        if (currentUser) {
            // Quick local check
            if (currentUser.role && currentUser.role.includes("seller")) {
                setIsSeller(true);
                setCheckingStatus(false);
            } else {
                checkSellerStatus();
            }
        } else {
            setCheckingStatus(false);
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.reason.trim()) {
            setError("Please provide a reason for applying");
            return;
        }

        setLoading(true);

        try {
            const response = await apiCall("/seller-application/apply", {
                method: "POST",
                body: JSON.stringify({
                    reason: formData.reason.trim(),
                    businessName: formData.businessName.trim() || undefined,
                }),
            });

            if (response.success) {
                setSuccess(true);
                // Update user in store with new role
                if (currentUser) {
                    const updatedUser = {
                        ...currentUser,
                        role: currentUser.role ? [...currentUser.role, "seller"] : ["buyer", "seller"],
                    };
                    updateUser(updatedUser);
                }
            }
        } catch (err) {
            setError(err.message || "Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    if (checkingStatus) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <Loading03Icon size={40} className="text-emerald-600 animate-spin" />
                </div>
                <Footer />
            </>
        );
    }

    // Already a seller
    if (isSeller) {
        return (
            <>
                <Helmet>
                    <title>Become a Seller | Lookups</title>
                </Helmet>
                <Header />
                <div className="min-h-screen bg-gray-50 py-12">
                    <div className="container mx-auto px-4 max-w-lg">
                        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckmarkCircle02Icon size={40} className="text-emerald-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                You're Already a Seller!
                            </h1>
                            <p className="text-gray-600 mb-8">
                                You already have seller privileges. Start listing your products now!
                            </p>
                            <Button
                                text="Add Your First Product"
                                onClick={() => navigate("/add-product")}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Success state
    if (success) {
        return (
            <>
                <Helmet>
                    <title>Application Approved | Lookups</title>
                </Helmet>
                <Header />
                <div className="min-h-screen bg-gray-50 py-12 mt-10">
                    <div className="container mx-auto px-4 max-w-lg">
                        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckmarkCircle02Icon size={40} className="text-emerald-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                Congratulations! 🎉
                            </h1>
                            <p className="text-gray-600 mb-8">
                                Your seller application has been approved! You can now start
                                listing products on Lookups.
                            </p>
                            <Button
                                text="Start Selling"
                                onClick={() => navigate("/add-product")}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Application form
    return (
        <>
            <Helmet>
                <title>Become a Seller | Lookups</title>
                <meta
                    name="description"
                    content="Apply to become a seller on Lookups and start listing your products."
                />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-lg">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                            <Store04Icon size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Become a Seller
                        </h1>
                        <p className="text-gray-600">
                            Join our marketplace and start selling your products today
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-8 border border-emerald-100">
                        <h3 className="font-semibold text-emerald-900 mb-4">
                            Why sell on Lookups?
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Reach thousands of potential buyers",
                                "Low commission fees",
                                "Easy product listing tools",
                                "Secure payment processing",
                            ].map((benefit, index) => (
                                <li key={index} className="flex items-center gap-3 text-emerald-800">
                                    <CheckmarkCircle02Icon size={20} className="text-emerald-600 flex-shrink-0" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Business Name (Optional)
                                </label>
                                <Input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    placeholder="Your business or store name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Why do you want to sell? *
                                </label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself and what you plan to sell..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                                    maxLength={500}
                                />
                                <p className="text-sm text-gray-500 mt-1 text-right">
                                    {formData.reason.length}/500
                                </p>
                            </div>

                            <Button
                                type="submit"
                                text={loading ? "Submitting..." : "Submit Application"}
                                disabled={loading}
                                className="w-full"
                            />

                            <p className="text-center text-sm text-gray-500">
                                By applying, you agree to our{" "}
                                <a href="/terms" className="text-emerald-600 hover:underline">
                                    Terms of Service
                                </a>{" "}
                                for sellers.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
