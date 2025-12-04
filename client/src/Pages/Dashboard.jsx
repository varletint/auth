import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import {
    DashboardSquare01Icon,
    ShoppingBag01Icon,
    MoneyReceiveSquareIcon,
    UserMultiple02Icon,
    ArrowUp01Icon,
    ArrowDown01Icon,
    Add01Icon,
} from "hugeicons-react";
import { productApi } from "../api/productApi";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock stats data
    const stats = [
        {
            title: "Total Sales",
            value: "₦2,450,000",
            change: "+12.5%",
            isPositive: true,
            icon: MoneyReceiveSquareIcon,
            color: "bg-emerald-500",
        },
        {
            title: "Products",
            value: "24",
            change: "+3",
            isPositive: true,
            icon: ShoppingBag01Icon,
            color: "bg-blue-500",
        },
        {
            title: "Customers",
            value: "156",
            change: "+8.2%",
            isPositive: true,
            icon: UserMultiple02Icon,
            color: "bg-purple-500",
        },
        {
            title: "Orders",
            value: "48",
            change: "-2.4%",
            isPositive: false,
            icon: DashboardSquare01Icon,
            color: "bg-orange-500",
        },
    ];

    // Mock recent orders
    const recentOrders = [
        { id: "ORD-001", customer: "John Doe", product: "iPhone 15 Pro", amount: 1899000, status: "completed" },
        { id: "ORD-002", customer: "Jane Smith", product: "Samsung S24", amount: 1450000, status: "pending" },
        { id: "ORD-003", customer: "Mike Brown", product: "AirPods Pro", amount: 450000, status: "shipping" },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productApi.getProducts({ limit: 5 });
                setProducts(data.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <Helmet>
                <title>Seller Dashboard | Lookups</title>
                <meta name="description" content="Manage your store, track sales, and view analytics." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <DashboardSquare01Icon size={32} className="text-emerald-600" />
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        </div>
                        <Link to="/add-product">
                            <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                                <Add01Icon size={20} />
                                Add Product
                            </button>
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat) => (
                            <div
                                key={stat.title}
                                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <stat.icon size={24} className="text-white" />
                                    </div>
                                    <div
                                        className={`flex items-center text-sm font-semibold ${stat.isPositive ? "text-emerald-600" : "text-red-500"
                                            }`}
                                    >
                                        {stat.isPositive ? <ArrowUp01Icon size={16} /> : <ArrowDown01Icon size={16} />}
                                        {stat.change}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                <p className="text-sm text-gray-500">{stat.title}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                                <Link to="/orders" className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold">
                                    View All →
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900">{order.customer}</p>
                                            <p className="text-sm text-gray-500">{order.product}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-emerald-600">₦{order.amount.toLocaleString()}</p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${order.status === "completed"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : order.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">My Products</h2>
                                <Link to="/my-products" className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold">
                                    Manage →
                                </Link>
                            </div>
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="animate-pulse flex gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : products.length > 0 ? (
                                <div className="space-y-4">
                                    {products.slice(0, 5).map((product) => (
                                        <Link
                                            key={product._id || product.id}
                                            to={`/product/${product._id || product.id}`}
                                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <img
                                                src={product.images?.[0] || "https://via.placeholder.com/48"}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{product.name}</p>
                                                <p className="text-sm text-emerald-600">₦{product.price?.toLocaleString()}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">Stock: {product.stock || 0}</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">No products yet. Add your first product!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
