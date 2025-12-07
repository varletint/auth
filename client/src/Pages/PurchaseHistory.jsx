import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { getMyOrders } from "../api/orderApi";
import {
    ShoppingBag01Icon,
    CheckmarkCircle02Icon,
    Loading03Icon,
    PackageIcon,
    Store01Icon,
} from "hugeicons-react";

export default function PurchaseHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ totalPurchases: 0, totalSpent: 0 });

    const fetchPurchaseHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            // Only fetch approved orders
            const data = await getMyOrders("approved", page, 10);
            if (data.success) {
                setOrders(data.orders);
                setTotalPages(data.totalPages);

                const totalSpent = data.orders.reduce((sum, order) => sum + order.totalPrice, 0);
                setStats({
                    totalPurchases: data.total,
                    totalSpent,
                });
            }
        } catch (err) {
            setError(err.message || "Failed to fetch purchase history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchaseHistory();
    }, [page]);

    return (
        <>
            <Helmet>
                <title>Purchase History | Lookups</title>
                <meta name="description" content="View your purchase history." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <ShoppingBag01Icon size={28} className="text-emerald-600" />
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Purchase History</h1>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-emerald-600">
                            <p className="text-sm text-gray-500 mb-1">Total Purchases</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalPurchases}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-600">
                            <p className="text-sm text-gray-500 mb-1">Page Total</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                ₦{stats.totalSpent.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loading03Icon size={40} className="animate-spin text-emerald-600" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                            {error}
                            <button onClick={fetchPurchaseHistory} className="ml-4 underline hover:no-underline">
                                Retry
                            </button>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <PackageIcon size={80} className="text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">No purchases yet</h2>
                            <p className="text-gray-500 mb-6">Your approved purchases will appear here.</p>
                            <Link to="/" className="text-emerald-600 font-semibold hover:underline">
                                Start Shopping →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
                                >
                                    {/* Order Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <CheckmarkCircle02Icon size={20} />
                                            <span className="font-semibold">Completed</span>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(order.statusUpdatedAt || order.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                                        <img
                                            src={order.product?.image || "https://via.placeholder.com/60"}
                                            alt={order.product?.name || "Product"}
                                            className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                                        />
                                        <div className="flex-1">
                                            <Link
                                                to={`/product/${order.product?.slug || order.product?.id}`}
                                                className="font-medium text-gray-900 hover:text-emerald-600"
                                            >
                                                {order.product?.name || "Product"}
                                            </Link>
                                            <p className="text-sm text-gray-500">
                                                Qty: {order.quantity} × ₦{order.unitPrice?.toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="text-lg font-bold text-emerald-600">
                                            ₦{order.totalPrice?.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Seller Info */}
                                    {order.seller && (
                                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                            <Store01Icon size={16} className="text-gray-400" />
                                            <span>Sold by </span>
                                            <Link
                                                to={`/seller/${order.seller.id}`}
                                                className="font-medium text-emerald-600 hover:underline"
                                            >
                                                {order.seller.username}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2 text-gray-600">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
