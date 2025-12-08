import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { customerApi } from "../api/customerApi";
import {
    UserMultiple02Icon,
    Add01Icon,
    Search01Icon,
    Loading03Icon,
    Cancel01Icon,
    Tick02Icon,
    AlertCircleIcon,
    Edit02Icon,
    Delete02Icon,
    Call02Icon,
    Mail01Icon,
} from "hugeicons-react";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [stats, setStats] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
    });
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCustomers();
        fetchStats();
    }, []);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchCustomers();
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [search]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await customerApi.getCustomers({ search, limit: 50 });
            setCustomers(data.customers || []);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await customerApi.getStats();
            setStats(data.stats);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const openAddModal = () => {
        setEditingCustomer(null);
        setFormData({ name: "", phone: "", email: "", address: "", notes: "" });
        setFormError("");
        setShowModal(true);
    };

    const openEditModal = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            phone: customer.phone || "",
            email: customer.email || "",
            address: customer.address || "",
            notes: customer.notes || "",
        });
        setFormError("");
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.name) {
            setFormError("Customer name is required");
            return;
        }

        setSubmitting(true);
        try {
            if (editingCustomer) {
                await customerApi.updateCustomer(editingCustomer._id, formData);
            } else {
                await customerApi.createCustomer(formData);
            }
            setShowModal(false);
            fetchCustomers();
            fetchStats();
        } catch (error) {
            setFormError(error.message || "Failed to save customer");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this customer?")) return;
        try {
            await customerApi.deleteCustomer(id);
            fetchCustomers();
            fetchStats();
        } catch (error) {
            alert(error.message || "Failed to delete");
        }
    };

    return (
        <>
            <Helmet>
                <title>Customers | Lookups Business</title>
                <meta name="description" content="Manage your customer list" />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <UserMultiple02Icon size={32} className="text-amber-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                        >
                            <Add01Icon size={20} />
                            Add Customer
                        </button>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Total Customers</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Active</p>
                                <p className="text-2xl font-bold text-green-600">{stats.activeCustomers}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Total Revenue</p>
                                <p className="text-2xl font-bold text-amber-600">₦{stats.totalRevenue?.toLocaleString()}</p>
                            </div>
                        </div>
                    )}

                    {/* Top Customers */}
                    {stats?.topCustomers && stats.topCustomers.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Top Customers</h3>
                            <div className="flex flex-wrap gap-3">
                                {stats.topCustomers.map((cust) => (
                                    <div key={cust.id} className="px-3 py-2 bg-amber-50 rounded-lg text-sm border border-amber-100">
                                        <span className="font-medium">{cust.name}</span>
                                        <span className="text-amber-600 ml-2">₦{cust.totalSpent?.toLocaleString()}</span>
                                        <span className="text-gray-400 ml-1">({cust.totalPurchases} orders)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="relative">
                            <Search01Icon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, phone, or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
                            />
                        </div>
                    </div>

                    {/* Customers List */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loading03Icon size={40} className="text-amber-600 animate-spin" />
                            </div>
                        ) : customers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <UserMultiple02Icon size={48} className="mb-4 opacity-50" />
                                <p>No customers found</p>
                                <button onClick={openAddModal} className="mt-4 text-amber-600 font-semibold hover:underline">
                                    Add your first customer
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {customers.map((customer) => (
                                    <div key={customer._id} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{customer.name}</p>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                                                    {customer.phone && (
                                                        <span className="flex items-center gap-1">
                                                            <Call02Icon size={14} />
                                                            {customer.phone}
                                                        </span>
                                                    )}
                                                    {customer.email && (
                                                        <span className="flex items-center gap-1">
                                                            <Mail01Icon size={14} />
                                                            {customer.email}
                                                        </span>
                                                    )}
                                                </div>
                                                {customer.totalPurchases > 0 && (
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {customer.totalPurchases} purchases • ₦{customer.totalSpent?.toLocaleString()} spent
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => openEditModal(customer)}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                                                >
                                                    <Edit02Icon size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer._id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Delete02Icon size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">{editingCustomer ? "Edit Customer" : "Add Customer"}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <Cancel01Icon size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {formError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                                    <AlertCircleIcon size={18} />
                                    {formError}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        placeholder="Customer name"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                            placeholder="08012345678"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        placeholder="Location"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        rows={2}
                                        placeholder="Any additional notes..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loading03Icon size={18} className="animate-spin" /> : <Tick02Icon size={18} />}
                                    {editingCustomer ? "Update" : "Add Customer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
