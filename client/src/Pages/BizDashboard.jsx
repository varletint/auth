import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import useAuthStore from "../store/useAuthStore";
import { inventoryApi } from "../api/inventoryApi";
import { salesApi } from "../api/salesApi";
import { customerApi } from "../api/customerApi";
import { expensesApi } from "../api/expensesApi";
import {
    Analytics01Icon,
    PackageIcon,
    MoneyBag01Icon,
    ChartLineData03Icon,
    UserMultiple02Icon,
    ShoppingBag01Icon,
    Calendar03Icon,
    ArrowUp02Icon,
    ArrowDown02Icon,
    Loading03Icon,
    Invoice02Icon,
} from "hugeicons-react";

export default function BizDashboard() {
    const { currentUser } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        inventory: { totalItems: 0, lowStockItems: 0 },
        sales: { totalSales: 0, totalRevenue: 0 },
        customers: { totalCustomers: 0 },
        expenses: { totalAmount: 0 },
    });

    useEffect(() => {
        fetchAllStats();
    }, []);

    const fetchAllStats = async () => {
        try {
            setLoading(true);
            const [invStats, salesStats, custStats, expStats] = await Promise.all([
                inventoryApi.getStats().catch(() => ({ stats: { totalItems: 0, lowStockItems: 0 } })),
                salesApi.getStats("today").catch(() => ({ stats: { totalSales: 0, totalRevenue: 0 } })),
                customerApi.getStats().catch(() => ({ stats: { totalCustomers: 0 } })),
                expensesApi.getStats("month").catch(() => ({ stats: { totalAmount: 0 } })),
            ]);

            setStats({
                inventory: invStats.stats || { totalItems: 0, lowStockItems: 0 },
                sales: salesStats.stats || { totalSales: 0, totalRevenue: 0 },
                customers: custStats.stats || { totalCustomers: 0 },
                expenses: expStats.stats || { totalAmount: 0 },
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: "Total Inventory",
            value: stats.inventory.totalItems,
            subtext: `${stats.inventory.lowStockItems} low stock`,
            icon: PackageIcon,
            color: "bg-blue-500",
            link: "/inventory",
        },
        {
            title: "Today's Sales",
            value: `₦${(stats.sales.totalRevenue || 0).toLocaleString()}`,
            subtext: `${stats.sales.totalSales || 0} transactions`,
            icon: MoneyBag01Icon,
            color: "bg-emerald-500",
            link: "/sales",
        },
        {
            title: "Customers",
            value: stats.customers.totalCustomers,
            subtext: "Total registered",
            icon: UserMultiple02Icon,
            color: "bg-amber-500",
            link: "/customers",
        },
        {
            title: "Monthly Expenses",
            value: `₦${(stats.expenses.totalAmount || 0).toLocaleString()}`,
            subtext: "This month",
            icon: Invoice02Icon,
            color: "bg-red-500",
            link: "/expenses",
        },
    ];

    const quickActions = [
        { title: "Record Sale", icon: MoneyBag01Icon, path: "/sales", color: "bg-emerald-500" },
        { title: "Add Stock", icon: PackageIcon, path: "/inventory", color: "bg-blue-500" },
        { title: "Add Expense", icon: Invoice02Icon, path: "/expenses", color: "bg-red-500" },
        { title: "Customers", icon: UserMultiple02Icon, path: "/customers", color: "bg-amber-500" },
    ];

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

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat) => (
                            <Link
                                key={stat.title}
                                to={stat.link}
                                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:-translate-y-1"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <stat.icon size={24} className="text-white" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                <p className="text-sm text-gray-500">{stat.title}</p>
                                <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
                            </Link>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.title}
                                    to={action.path}
                                    className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                                >
                                    <div className={`${action.color} p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                                        <action.icon size={24} className="text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{action.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Cards */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <Link to="/sales" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Sales</h2>
                                <MoneyBag01Icon size={24} className="text-emerald-600" />
                            </div>
                            <p className="text-gray-500 mb-4">Record and track all your sales transactions</p>
                            <span className="text-emerald-600 font-semibold text-sm">Go to Sales →</span>
                        </Link>

                        <Link to="/inventory" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Inventory</h2>
                                <PackageIcon size={24} className="text-blue-600" />
                            </div>
                            <p className="text-gray-500 mb-4">Manage your stock and track inventory levels</p>
                            <span className="text-blue-600 font-semibold text-sm">Go to Inventory →</span>
                        </Link>
                    </div>

                    {/* Switch to Marketplace */}
                    <div className="mt-8 bg-gray-100 rounded-xl p-6 text-center">
                        <p className="text-gray-600 mb-3">Want to buy or sell products on the marketplace?</p>
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

