import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import useAuthStore from "../store/useAuthStore";
import { getSellerOrders, updateOrderStatus } from "../api/orderApi";
import {
    PackageIcon,
    CheckmarkCircle02Icon,
    Clock01Icon,
    Cancel01Icon,
    Loading03Icon,
    UserIcon,
    Call02Icon,
    Mail01Icon,
} from "hugeicons-react";

export default function Orders() {
    const { currentUser } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [updatingOrder, setUpdatingOrder] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const statusConfig = {
        pending: {
            icon: Clock01Icon,
            color: "text-yellow-600 bg-yellow-100",
            label: "Pending",
        },
        approved: {
            icon: CheckmarkCircle02Icon,
            color: "text-emerald-600 bg-emerald-100",
            label: "Approved",
        },
        declined: {
            icon: Cancel01Icon,
            color: "text-red-600 bg-red-100",
            label: "Declined",
        },
    };

    // Fetch seller orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getSellerOrders(statusFilter || null, page, 10);
            if (data.success) {
                setOrders(data.orders);
                setTotalPages(data.totalPages);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, page]);

    // Handle order status update
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setUpdatingOrder(orderId);
            const data = await updateOrderStatus(orderId, newStatus);
            if (data.success) {
                // Update local state
                setOrders((prev) =>
                    prev.map((order) =>
                        order.id === orderId
                            ? { ...order, status: newStatus, statusUpdatedAt: new Date().toISOString() }
                            : order
                    )
                );
            }
        } catch (err) {
            alert(err.message || "Failed to update order");
        } finally {
            setUpdatingOrder(null);
        }
    };

    // Check if user is a seller
    const isSeller = currentUser?.role?.includes("seller");

    if (!isSeller) {
        return (
            <>
                <Helmet>
                    <title>Orders | Lookups</title>
                </Helmet>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <PackageIcon size={80} className="text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">Seller Access Only</h2>
                            <p className="text-gray-500 mb-6">
                                This page is for sellers to manage incoming orders.
                            </p>
                            <Link to="/my-orders">
                                <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                                    View My Orders
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Manage Orders | Lookups</title>
                <meta name="description" content="Manage orders for your products on Lookups." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
                        <div className="flex items-center gap-3">
                            <PackageIcon size={25} className="text-emerald-600" />
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Incoming Orders</h1>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="declined">Declined</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loading03Icon size={40} className="animate-spin text-emerald-600" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                            {error}
                            <button
                                onClick={fetchOrders}
                                className="ml-4 underline hover:no-underline"
                            >
                                Retry
                            </button>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <PackageIcon size={80} className="text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
                            <p className="text-gray-500 mb-6">
                                Orders for your products will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const status = statusConfig[order.status];
                                const StatusIcon = status.icon;
                                return (
                                    <div
                                        key={order.id}
                                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                                    >
                                        {/* Header */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.color}`}>
                                                <StatusIcon size={16} />
                                                <span className="text-sm font-semibold">{status.label}</span>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex items-center gap-4 py-4 border-t border-b border-gray-100">
                                            <img
                                                src={order.product?.image || "https://via.placeholder.com/60"}
                                                alt={order.product?.name || "Product"}
                                                className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                                            />
                                            <div className="flex-1">
                                                <Link
                                                    to={`/product/${order.product?.slug || order.product?.id}`}
                                                    className="font-medium text-gray-900 hover:text-emerald-600"
                                                >
                                                    {order.product?.name || "Product Unavailable"}
                                                </Link>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {order.quantity} × ₦{order.unitPrice?.toLocaleString()}
                                                </p>
                                            </div>
                                            <p className="text-lg font-bold text-emerald-600">
                                                ₦{order.totalPrice?.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Buyer Info */}
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Buyer Info</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <UserIcon size={14} />
                                                    {order.buyer?.username || "N/A"}
                                                </div>
                                                {order.buyer?.phone && (
                                                    <a
                                                        href={`tel:${order.buyer.phone}`}
                                                        className="flex items-center gap-1 hover:text-emerald-600"
                                                    >
                                                        <Call02Icon size={14} />
                                                        {order.buyer.phone}
                                                    </a>
                                                )}
                                                {order.buyer?.email && (
                                                    <a
                                                        href={`mailto:${order.buyer.email}`}
                                                        className="flex items-center gap-1 hover:text-emerald-600"
                                                    >
                                                        <Mail01Icon size={14} />
                                                        {order.buyer.email}
                                                    </a>
                                                )}
                                            </div>
                                            {order.buyerNotes && (
                                                <p className="mt-2 text-sm text-gray-600 italic">
                                                    "{order.buyerNotes}"
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        {order.status === "pending" && (
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, "approved")}
                                                    disabled={updatingOrder === order.id}
                                                    className="flex-1 py-2 bg-emerald-600 text-white 
                                                    font-semibold rounded-lg hover:bg-emerald-700 
                                                    transition-colors disabled:opacity-50 flex items-center 
                                                    justify-center gap-2 text-nowrap"
                                                >
                                                    {updatingOrder === order.id ? (
                                                        <Loading03Icon size={16} className="animate-spin" />
                                                    ) : (
                                                        <CheckmarkCircle02Icon size={16} />
                                                    )}
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, "declined")}
                                                    disabled={updatingOrder === order.id}
                                                    className="flex-1 py-2 text-nowrap bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {updatingOrder === order.id ? (
                                                        <Loading03Icon size={16} className="animate-spin" />
                                                    ) : (
                                                        <Cancel01Icon size={16} />
                                                    )}
                                                    Decline
                                                </button>
                                            </div>
                                        )}

                                        {order.status !== "pending" && order.statusUpdatedAt && (
                                            <p className="mt-4 text-xs text-gray-400 text-right">
                                                {order.status === "approved" ? "Approved" : "Declined"} on{" "}
                                                {new Date(order.statusUpdatedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}

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
