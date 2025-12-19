import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [stats, setStats] = useState(null);
    // Form mode: 'standard' or 'bulk'
    const [formMode, setFormMode] = useState("standard");

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
        // Multi-unit fields
        baseUnit: "kg",
        baseQuantity: "",
        sellingUnits: [{ name: "", conversionFactor: "", costPrice: "", sellingPrice: "", isDefault: true }],
    });
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const categories = ["General", "Electronics", "Clothing", "Food", "Beverages", "Stationery", "Health", "Beauty", "Other"];
    const units = ["pieces", "kg", "g", "liters", "ml", "meters", "boxes", "packs", "dozen", "carton", "bag", "bottle", "other"];
    const baseUnits = ["kg", "g", "liters", "ml", "pieces", "meters", "units"];

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
        setFormMode("standard");
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
            baseUnit: "kg",
            baseQuantity: "",
            sellingUnits: [{ name: "", conversionFactor: "", costPrice: "", sellingPrice: "", isDefault: true }],
        });
        setFormError("");
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormMode(item.hasMultipleUnits ? "bulk" : "standard");
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
            baseUnit: item.baseUnit || "kg",
            baseQuantity: item.baseQuantity?.toString() || "",
            sellingUnits: item.sellingUnits?.length > 0
                ? item.sellingUnits.map(u => ({
                    name: u.name,
                    conversionFactor: u.conversionFactor?.toString() || "",
                    costPrice: u.costPrice?.toString() || "",
                    sellingPrice: u.sellingPrice?.toString() || "",
                    isDefault: u.isDefault || false,
                }))
                : [{ name: "", conversionFactor: "", costPrice: "", sellingPrice: "", isDefault: true }],
        });
        setFormError("");
        setShowModal(true);
    };

    // Manage selling units for multi-unit mode
    const addSellingUnit = () => {
        setFormData({
            ...formData,
            sellingUnits: [...formData.sellingUnits, { name: "", conversionFactor: "", costPrice: "", sellingPrice: "", isDefault: false }],
        });
    };

    const removeSellingUnit = (index) => {
        if (formData.sellingUnits.length === 1) return;
        const newUnits = formData.sellingUnits.filter((_, i) => i !== index);
        // Ensure at least one default
        if (!newUnits.some(u => u.isDefault) && newUnits.length > 0) {
            newUnits[0].isDefault = true;
        }
        setFormData({ ...formData, sellingUnits: newUnits });
    };

    const updateSellingUnit = (index, field, value) => {
        const newUnits = [...formData.sellingUnits];
        if (field === "isDefault" && value) {
            // Only one can be default
            newUnits.forEach((u, i) => u.isDefault = i === index);
        } else {
            newUnits[index][field] = value;
        }
        setFormData({ ...formData, sellingUnits: newUnits });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.name) {
            setFormError("Item name is required");
            return;
        }

        if (formMode === "standard") {
            if (!formData.costPrice || !formData.sellingPrice) {
                setFormError("Cost price and selling price are required");
                return;
            }
        } else {
            // Bulk mode validation
            if (!formData.baseUnit) {
                setFormError("Base unit is required for bulk items");
                return;
            }
            const validUnits = formData.sellingUnits.filter(u => u.name && u.conversionFactor && u.sellingPrice);
            if (validUnits.length === 0) {
                setFormError("At least one complete selling unit is required");
                return;
            }
        }

        setSubmitting(true);
        try {
            let itemData;

            if (formMode === "bulk") {
                // Multi-unit item
                itemData = {
                    name: formData.name,
                    description: formData.description,
                    sku: formData.sku,
                    category: formData.category,
                    lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
                    hasMultipleUnits: true,
                    baseUnit: formData.baseUnit,
                    baseQuantity: parseFloat(formData.baseQuantity) || 0,
                    sellingUnits: formData.sellingUnits
                        .filter(u => u.name && u.conversionFactor && u.sellingPrice)
                        .map(u => ({
                            name: u.name,
                            label: `${u.name} (${u.conversionFactor} ${formData.baseUnit})`,
                            conversionFactor: parseFloat(u.conversionFactor),
                            costPrice: parseFloat(u.costPrice) || 0,
                            sellingPrice: parseFloat(u.sellingPrice),
                            isDefault: u.isDefault,
                        })),
                };
            } else {
                // Standard item
                itemData = {
                    name: formData.name,
                    description: formData.description,
                    sku: formData.sku,
                    category: formData.category,
                    costPrice: parseFloat(formData.costPrice),
                    sellingPrice: parseFloat(formData.sellingPrice),
                    quantity: parseInt(formData.quantity) || 0,
                    lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
                    unit: formData.unit,
                    hasMultipleUnits: false,
                };
            }

            if (editingItem) {
                await inventoryApi.updateItem(editingItem._id, itemData);
            } else {
                // Generate idempotency key for new items
                itemData.idempotencyKey = crypto.randomUUID();
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
            <div className="min-h-screen bg-gray-50 py-8">
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
                                                        <button
                                                            onClick={() => navigate(`/inventory/${item._id}`)}
                                                            className="font-medium text-gray-900 hover:text-blue-600 hover:underline text-left"
                                                        >
                                                            {item.name}
                                                        </button>
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
                                {/* Mode Toggle - at the very top */}
                                <div className="flex rounded-lg bg-gray-100 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setFormMode("standard")}
                                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${formMode === "standard"
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900"
                                            }`}
                                    >
                                        📦 Standard
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormMode("bulk")}
                                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${formMode === "bulk"
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900"
                                            }`}
                                    >
                                        📊 Bulk / Multi-Unit
                                    </button>
                                </div>

                                {/* Item Name - Common to both modes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder={formMode === "bulk" ? "e.g., Premium Rice" : "e.g., iPhone 15 Pro"}
                                    />
                                </div>

                                {/* Category & SKU - Common */}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                        <input
                                            type="text"
                                            value={formData.sku}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                            placeholder="e.g., RICE-001"
                                        />
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                {/* ========== STANDARD MODE FIELDS ========== */}
                                {formMode === "standard" && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
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
                                    </>
                                )}

                                {/* ========== BULK / MULTI-UNIT MODE FIELDS ========== */}
                                {formMode === "bulk" && (
                                    <>
                                        {/* Stock Tracking Section */}
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-blue-800 mb-3">📊 Stock Tracking</h4>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Base Unit *</label>
                                                    <select
                                                        value={formData.baseUnit}
                                                        onChange={(e) => setFormData({ ...formData, baseUnit: e.target.value })}
                                                        className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                    >
                                                        {baseUnits.map((u) => (
                                                            <option key={u} value={u}>{u}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Stock ({formData.baseUnit})</label>
                                                    <input
                                                        type="number"
                                                        value={formData.baseQuantity}
                                                        onChange={(e) => setFormData({ ...formData, baseQuantity: e.target.value })}
                                                        className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="0"
                                                        step="0.01"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Low Stock</label>
                                                    <input
                                                        type="number"
                                                        value={formData.lowStockThreshold}
                                                        onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                                                        className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="5"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Selling Units Section */}
                                        <div className="bg-emerald-50 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-emerald-800 mb-3">📦 Selling Units</h4>
                                            <div className="space-y-2">
                                                {/* Header */}
                                                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
                                                    <div className="col-span-2">Name</div>
                                                    <div className="col-span-2">= {formData.baseUnit}</div>
                                                    <div className="col-span-3">Cost ₦</div>
                                                    <div className="col-span-3">Price ₦</div>
                                                    <div className="col-span-1">Def</div>
                                                    <div className="col-span-1"></div>
                                                </div>

                                                {/* Rows */}
                                                {formData.sellingUnits.map((unit, index) => (
                                                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                                        <input
                                                            type="text"
                                                            value={unit.name}
                                                            onChange={(e) => updateSellingUnit(index, "name", e.target.value)}
                                                            className="col-span-2 px-2 py-1.5 border border-gray-200 rounded text-sm"
                                                            placeholder="kg"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={unit.conversionFactor}
                                                            onChange={(e) => updateSellingUnit(index, "conversionFactor", e.target.value)}
                                                            className="col-span-2 px-2 py-1.5 border border-gray-200 rounded text-sm"
                                                            placeholder="1"
                                                            step="0.001"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={unit.costPrice}
                                                            onChange={(e) => updateSellingUnit(index, "costPrice", e.target.value)}
                                                            className="col-span-3 px-2 py-1.5 border border-gray-200 rounded text-sm"
                                                            placeholder="0"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={unit.sellingPrice}
                                                            onChange={(e) => updateSellingUnit(index, "sellingPrice", e.target.value)}
                                                            className="col-span-3 px-2 py-1.5 border border-gray-200 rounded text-sm"
                                                            placeholder="0"
                                                        />
                                                        <div className="col-span-1 flex justify-center">
                                                            <input
                                                                type="radio"
                                                                checked={unit.isDefault}
                                                                onChange={() => updateSellingUnit(index, "isDefault", true)}
                                                                className="w-4 h-4 text-blue-600"
                                                            />
                                                        </div>
                                                        <div className="col-span-1 flex justify-center">
                                                            {formData.sellingUnits.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeSellingUnit(index)}
                                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                                >
                                                                    ✕
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={addSellingUnit}
                                                    className="text-sm text-emerald-600 font-medium hover:underline mt-2"
                                                >
                                                    + Add Selling Unit
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-3">
                                                💡 Example: "bag" = 5 means 1 bag equals 5 {formData.baseUnit}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {/* Description - Common */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        rows={2}
                                        placeholder="Brief description..."
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
