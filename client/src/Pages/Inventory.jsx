import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { inventoryApi } from "../api/inventoryApi";
import {
    PackageIcon,
    Add01Icon,
    Search01Icon,
    Edit02Icon,
    Delete02Icon,
    Loading03Icon,
    AlertCircleIcon,
    RefreshIcon,
    Cancel01Icon,
    Tick02Icon,
} from "hugeicons-react";

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [stats, setStats] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        sku: "",
        category: "General",
        costPrice: "",
        sellingPrice: "",
        quantity: "",
        lowStockThreshold: "5",
        unit: "pieces",
    });
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const categories = ["General", "Electronics", "Clothing", "Food", "Beverages", "Stationery", "Health", "Beauty", "Other"];
    const units = ["pieces", "kg", "g", "liters", "ml", "meters", "boxes", "packs", "dozen", "other"];

    useEffect(() => {
        fetchItems();
        fetchStats();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await inventoryApi.getItems({ search, limit: 50 });
            setItems(data.items || []);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await inventoryApi.getStats();
            setStats(data.stats);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchItems();
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [search]);

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            name: "",
            description: "",
            sku: "",
            category: "General",
            costPrice: "",
            sellingPrice: "",
            quantity: "",
            lowStockThreshold: "5",
            unit: "pieces",
        });
        setFormError("");
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description || "",
            sku: item.sku || "",
            category: item.category || "General",
            costPrice: item.costPrice?.toString() || "",
            sellingPrice: item.sellingPrice?.toString() || "",
            quantity: item.quantity?.toString() || "",
            lowStockThreshold: item.lowStockThreshold?.toString() || "5",
            unit: item.unit || "pieces",
        });
        setFormError("");
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.name || !formData.costPrice || !formData.sellingPrice) {
            setFormError("Name, cost price, and selling price are required");
            return;
        }

        setSubmitting(true);
        try {
            const itemData = {
                ...formData,
                costPrice: parseFloat(formData.costPrice),
                sellingPrice: parseFloat(formData.sellingPrice),
                quantity: parseInt(formData.quantity) || 0,
                lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
            };

            if (editingItem) {
                await inventoryApi.updateItem(editingItem._id, itemData);
            } else {
                await inventoryApi.createItem(itemData);
            }

            setShowModal(false);
            fetchItems();
            fetchStats();
        } catch (error) {
            setFormError(error.message || "Failed to save item");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            await inventoryApi.deleteItem(id);
            fetchItems();
            fetchStats();
        } catch (error) {
            alert(error.message || "Failed to delete item");
        }
    };

    const handleRestock = async (item) => {
        const quantity = prompt(`Enter quantity to add to "${item.name}":`);
        if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) return;

        try {
            await inventoryApi.restockItem(item._id, { quantity: parseInt(quantity) });
            fetchItems();
            fetchStats();
        } catch (error) {
            alert(error.message || "Failed to restock item");
        }
    };

    return (
        <>
            <Helmet>
                <title>Inventory | Lookups Business</title>
                <meta name="description" content="Manage your inventory and stock levels" />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <PackageIcon size={32} className="text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            <Add01Icon size={20} />
                            Add Item
                        </button>
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Total Items</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Stock Value</p>
                                <p className="text-2xl font-bold text-emerald-600">₦{stats.totalValue?.toLocaleString()}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Low Stock</p>
                                <p className="text-2xl font-bold text-amber-600">{stats.lowStockItems}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Out of Stock</p>
                                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                            </div>
                        </div>
                    )}

                    {/* Search */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="relative">
                            <Search01Icon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search items by name or SKU..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loading03Icon size={40} className="text-blue-600 animate-spin" />
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <PackageIcon size={48} className="mb-4 opacity-50" />
                                <p>No inventory items found</p>
                                <button onClick={openAddModal} className="mt-4 text-blue-600 font-semibold hover:underline">
                                    Add your first item
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Item</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Cost</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Price</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Qty</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {items.map((item) => (
                                            <tr key={item._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                        {item.sku && <p className="text-xs text-gray-500">SKU: {item.sku}</p>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-600">₦{item.costPrice?.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600">₦{item.sellingPrice?.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <span
                                                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${item.quantity === 0
                                                            ? "bg-red-100 text-red-700"
                                                            : item.quantity <= item.lowStockThreshold
                                                                ? "bg-amber-100 text-amber-700"
                                                                : "bg-green-100 text-green-700"
                                                            }`}
                                                    >
                                                        {item.quantity} {item.unit}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleRestock(item)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                            title="Restock"
                                                        >
                                                            <RefreshIcon size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => openEditModal(item)}
                                                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit02Icon size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                            title="Delete"
                                                        >
                                                            <Delete02Icon size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                            <h2 className="text-xl font-bold">{editingItem ? "Edit Item" : "Add New Item"}</h2>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder="e.g., iPhone 15 Pro"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price *</label>
                                        <input
                                            type="number"
                                            value={formData.costPrice}
                                            onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
                                        <input
                                            type="number"
                                            value={formData.sellingPrice}
                                            onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                        <input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
                                        <input
                                            type="number"
                                            value={formData.lowStockThreshold}
                                            onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="5"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                        <select
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        >
                                            {units.map((unit) => (
                                                <option key={unit} value={unit}>{unit}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder="e.g., IP15PRO-256"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        rows={3}
                                        placeholder="Brief description of the item..."
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
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <Loading03Icon size={18} className="animate-spin" />
                                    ) : (
                                        <Tick02Icon size={18} />
                                    )}
                                    {editingItem ? "Update" : "Add Item"}
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
