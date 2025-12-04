import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { PackageIcon, DeliveryTruck01Icon, CheckmarkCircle02Icon, Clock01Icon } from "hugeicons-react";

export default function Orders() {
    // Mock orders data
    const [orders] = useState([
        {
            id: "ORD-2024-001",
            date: "Dec 3, 2024",
            status: "delivered",
            total: 1899000,
            items: [
                { name: "iPhone 15 Pro Max", quantity: 1, image: "https://via.placeholder.com/60" },
            ],
        },
        {
            id: "ORD-2024-002",
            date: "Dec 1, 2024",
            status: "shipping",
            total: 2900000,
            items: [
                { name: "Samsung Galaxy S24 Ultra", quantity: 2, image: "https://via.placeholder.com/60" },
            ],
        },
        {
            id: "ORD-2024-003",
            date: "Nov 28, 2024",
            status: "processing",
            total: 450000,
            items: [
                { name: "AirPods Pro 2", quantity: 1, image: "https://via.placeholder.com/60" },
            ],
        },
    ]);

    const statusConfig = {
        processing: {
            icon: Clock01Icon,
            color: "text-yellow-600 bg-yellow-100",
            label: "Processing",
        },
        shipping: {
            icon: DeliveryTruck01Icon,
            color: "text-blue-600 bg-blue-100",
            label: "Shipping",
        },
        delivered: {
            icon: CheckmarkCircle02Icon,
            color: "text-emerald-600 bg-emerald-100",
            label: "Delivered",
        },
    };

    return (
        <>
            <Helmet>
                <title>My Orders | Lookups</title>
                <meta name="description" content="Track and manage your orders on Lookups." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="flex items-center gap-3 mb-8">
                        <PackageIcon size={32} className="text-emerald-600" />
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <PackageIcon size={80} className="text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
                            <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
                            <Link to="/">
                                <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                                    Start Shopping
                                </button>
                            </Link>
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
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{order.id}</h3>
                                                <p className="text-sm text-gray-500">{order.date}</p>
                                            </div>
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.color}`}>
                                                <StatusIcon size={16} />
                                                <span className="text-sm font-semibold">{status.label}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 py-4 border-t border-b border-gray-100">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <p className="text-lg font-bold text-emerald-600">
                                                ₦{order.total.toLocaleString()}
                                            </p>
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                                            >
                                                View Details →
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
