import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import useAuthStore from "../store/useAuthStore";
import {
    Analytics01Icon,
    PackageIcon,
    MoneyBag01Icon,
    ChartLineData03Icon,
    Add01Icon,
    UserMultiple02Icon,
    ShoppingBag01Icon,
    Calendar03Icon,
    ArrowUp02Icon,
    ArrowDown02Icon,
    Loading03Icon,
} from "hugeicons-react";

export default function BizDashboard() {
    const { currentUser } = useAuthStore();
    const [loading, setLoading] = useState(true);

    // Placeholder stats - will be replaced with real data in Phase 2
    const stats = [
        {
            title: "Total Inventory",
            value: "0",
            change: "Coming soon",
            isPositive: true,
            icon: PackageIcon,
            color: "bg-blue-500",
            link: "/inventory",
        },
        {
            title: "Today's Sales",
            value: "₦0",
            change: "Start recording",
            isPositive: true,
            icon: MoneyBag01Icon,
            color: "bg-emerald-500",
            link: "/sales",
        },
        {
            title: "Monthly Revenue",
            value: "₦0",
            change: "0%",
            isPositive: true,
            icon: ChartLineData03Icon,
            color: "bg-purple-500",
            link: "/reports",
        },
        {
            title: "Customers",
            value: "0",
            change: "Coming soon",
            isPositive: true,
            icon: UserMultiple02Icon,
            color: "bg-amber-500",
            link: "/customers",
        },
    ];

    // Quick actions for business management
    const quickActions = [
        { title: "Add Sale", icon: MoneyBag01Icon, path: "/sales/new", color: "bg-emerald-500" },
        { title: "Add Stock", icon: PackageIcon, path: "/inventory/new", color: "bg-blue-500" },
        { title: "Add Expense", icon: ShoppingBag01Icon, path: "/expenses/new", color: "bg-red-500" },
        { title: "View Reports", icon: Analytics01Icon, path: "/reports", color: "bg-purple-500" },
    ];

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-10">
                    <Loading03Icon size={40} className="text-emerald-600 animate-spin" />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Business Dashboard | Lookups</title>
                <meta name="description" content="Manage your business - track inventory, sales, and expenses." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <Analytics01Icon size={32} className="text-emerald-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
                                <p className="text-gray-500 text-sm">Welcome back, {currentUser?.username || "User"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar03Icon size={16} />
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    {/* Coming Soon Banner */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 mb-8 text-white shadow-lg shadow-emerald-200">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <Analytics01Icon size={28} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-1">🚧 Business Management Features Coming Soon!</h2>
                                    <p className="text-emerald-100">
                                        Inventory tracking, sales recording, expense management, and reports are on the way.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat) => (
                            <div
                                key={stat.title}
                                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <stat.icon size={24} className="text-white" />
                                    </div>
                                    <div
                                        className={`flex items-center text-sm font-semibold ${stat.isPositive ? "text-emerald-600" : "text-red-500"
                                            }`}
                                    >
                                        {stat.isPositive ? <ArrowUp02Icon size={16} /> : <ArrowDown02Icon size={16} />}
                                        {stat.change}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                <p className="text-sm text-gray-500">{stat.title}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {quickActions.map((action) => (
                                <button
                                    key={action.title}
                                    className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group cursor-not-allowed opacity-60"
                                    disabled
                                >
                                    <div className={`${action.color} p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                                        <action.icon size={24} className="text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{action.title}</span>
                                    <span className="text-xs text-gray-400 mt-1">Coming Soon</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Placeholder Sections */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Recent Sales */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Recent Sales</h2>
                                <span className="text-emerald-600 text-sm font-semibold">Coming Soon</span>
                            </div>
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <MoneyBag01Icon size={48} className="mb-4 opacity-50" />
                                <p className="text-center">Start recording your sales to see them here</p>
                            </div>
                        </div>

                        {/* Low Stock Alerts */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Low Stock Alerts</h2>
                                <span className="text-emerald-600 text-sm font-semibold">Coming Soon</span>
                            </div>
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <PackageIcon size={48} className="mb-4 opacity-50" />
                                <p className="text-center">Add inventory items to track stock levels</p>
                            </div>
                        </div>
                    </div>

                    {/* Switch to Marketplace prompt */}
                    <div className="mt-8 bg-gray-100 rounded-xl p-6 text-center">
                        <p className="text-gray-600 mb-3">Want to buy or sell products?</p>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                            <ShoppingBag01Icon size={20} />
                            Switch to Marketplace
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
