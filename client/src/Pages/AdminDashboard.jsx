import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import useAuthStore from "../store/useAuthStore";
import { apiCall } from "../api/api";
import {
    DashboardSquare01Icon,
    UserMultiple02Icon,
    ShoppingBag01Icon,
    Store04Icon,
    ArrowUp01Icon,
    Loading03Icon,
    UserIcon,
    CheckmarkCircle02Icon,
    Cancel01Icon,
    TimeQuarter01Icon,
} from "hugeicons-react";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { currentUser } = useAuthStore();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Check if user is admin
    const isAdmin = currentUser?.role?.includes("admin");

    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        if (!isAdmin) {
            navigate("/dashboard");
            return;
        }
        fetchStats();
    }, [currentUser, isAdmin, navigate]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await apiCall("/admin/stats", "GET");
            if (response.success) {
                setStats(response.stats);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch stats");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
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

    if (error) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchStats}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                        >
                            Retry
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const statCards = [
        {
            title: "Total Users",
            value: stats?.users?.total || 0,
            subtitle: `+${stats?.users?.newThisWeek || 0} this week`,
            icon: UserMultiple02Icon,
            color: "bg-blue-500",
        },
        {
            title: "Total Products",
            value: stats?.products?.total || 0,
            subtitle: `+${stats?.products?.newThisWeek || 0} this week`,
            icon: ShoppingBag01Icon,
            color: "bg-emerald-500",
        },
        {
            title: "Seller Applications",
            value: stats?.sellerApplications?.total || 0,
            subtitle: `${stats?.sellerApplications?.pending || 0} pending`,
            icon: Store04Icon,
            color: "bg-purple-500",
        },
    ];

    const userBreakdown = [
        { label: "Admins", count: stats?.users?.admins || 0, icon: DashboardSquare01Icon, color: "text-red-600" },
        { label: "Sellers", count: stats?.users?.sellers || 0, icon: Store04Icon, color: "text-purple-600" },
        { label: "Buyers", count: stats?.users?.buyers || 0, icon: UserIcon, color: "text-blue-600" },
    ];

    const applicationBreakdown = [
        { label: "Approved", count: stats?.sellerApplications?.approved || 0, icon: CheckmarkCircle02Icon, color: "text-emerald-600" },
        { label: "Pending", count: stats?.sellerApplications?.pending || 0, icon: TimeQuarter01Icon, color: "text-amber-600" },
        { label: "Rejected", count: stats?.sellerApplications?.rejected || 0, icon: Cancel01Icon, color: "text-red-600" },
    ];

    return (
        <>
            <Helmet>
                <title>Admin Dashboard | Lookups</title>
                <meta name="description" content="Admin dashboard for managing Lookups platform." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <DashboardSquare01Icon size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-500">Platform overview and statistics</p>
                        </div>
                    </div>

                    {/* Main Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {statCards.map((stat) => (
                            <div
                                key={stat.title}
                                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <stat.icon size={24} className="text-white" />
                                    </div>
                                    <div className="flex items-center text-sm font-semibold text-emerald-600">
                                        <ArrowUp01Icon size={16} />
                                        {stat.subtitle}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</h3>
                                <p className="text-gray-500">{stat.title}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* User Breakdown */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Users by Role</h2>
                            <div className="space-y-4">
                                {userBreakdown.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={24} className={item.color} />
                                            <span className="font-medium text-gray-700">{item.label}</span>
                                        </div>
                                        <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Seller Applications Breakdown */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Seller Applications</h2>
                            <div className="space-y-4">
                                {applicationBreakdown.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={24} className={item.color} />
                                            <span className="font-medium text-gray-700">{item.label}</span>
                                        </div>
                                        <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link
                                to="/admin/users"
                                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <UserMultiple02Icon size={28} className="text-blue-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Manage Users</span>
                            </Link>
                            <Link
                                to="/admin/products"
                                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <ShoppingBag01Icon size={28} className="text-emerald-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Manage Products</span>
                            </Link>
                            <Link
                                to="/admin/applications"
                                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <Store04Icon size={28} className="text-purple-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Applications</span>
                            </Link>
                            <Link
                                to="/dashboard"
                                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <DashboardSquare01Icon size={28} className="text-orange-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700">User Dashboard</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
