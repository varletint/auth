import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { inventoryApi } from "../api/inventoryApi";
import {
    PackageIcon,
    ArrowLeft01Icon,
    RefreshIcon,
    ArrowDown01Icon,
    Edit02Icon,
    Loading03Icon,
    AlertCircleIcon,
    ArrowUp01Icon,
    Cancel01Icon,
    Tick02Icon,
    Calendar03Icon,
    MoneyReceiveSquareIcon,
    PercentIcon,
} from "hugeicons-react";

export default function ItemPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal states
    const [showRestockModal, setShowRestockModal] = useState(false);
    const [showStockOutModal, setShowStockOutModal] = useState(false);
    const [modalData, setModalData] = useState({ quantity: "", reason: "" });
    const [submitting, setSubmitting] = useState(false);
    const [modalError, setModalError] = useState("");

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await inventoryApi.getItemWithHistory(id);
            setItem(data.item);
        } catch (error) {
            setError(error.message || "Failed to load item");
        } finally {
            setLoading(false);
        }
    };

    const generateIdempotencyKey = () => {
        return crypto.randomUUID();
    };

    const handleRestock = async (e) => {
        e.preventDefault();
        if (!modalData.quantity || parseInt(modalData.quantity) <= 0) {
            setModalError("Quantity must be a positive number");
            return;
        }

        setSubmitting(true);
        setModalError("");
        try {
            await inventoryApi.restockItem(id, {
                quantity: parseInt(modalData.quantity),
                reason: modalData.reason || "Restock",
                idempotencyKey: generateIdempotencyKey(),
            });
            setShowRestockModal(false);
            setModalData({ quantity: "", reason: "" });
            fetchItem();
        } catch (error) {
            setModalError(error.message || "Failed to restock");
        } finally {
            setSubmitting(false);
        }
    };

    const handleStockOut = async (e) => {
        e.preventDefault();
        if (!modalData.quantity || parseInt(modalData.quantity) <= 0) {
            setModalError("Quantity must be a positive number");
            return;
        }
        if (!modalData.reason) {
            setModalError("Reason is required");
            return;
        }

        setSubmitting(true);
        setModalError("");
        try {
            await inventoryApi.stockOutItem(id, {
                quantity: parseInt(modalData.quantity),
                reason: modalData.reason,
                idempotencyKey: generateIdempotencyKey(),
            });
            setShowStockOutModal(false);
            setModalData({ quantity: "", reason: "" });
            fetchItem();
        } catch (error) {
            setModalError(error.message || "Failed to stock out");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTypeBadge = (type) => {
        const styles = {
            in: "bg-green-100 text-green-700",
            out: "bg-red-100 text-red-700",
            adjustment: "bg-blue-100 text-blue-700",
        };
        const labels = {
            in: "Stock In",
            out: "Stock Out",
            adjustment: "Adjustment",
        };
        return (
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
                {labels[type]}
            </span>
        );
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <Loading03Icon size={40} className="text-blue-600 animate-spin" />
                </div>
                <Footer />
            </>
        );
    }

    if (error || !item) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                    <AlertCircleIcon size={48} className="text-red-500 mb-4" />
                    <p className="text-lg text-gray-700 mb-4">{error || "Item not found"}</p>
                    <button
                        onClick={() => navigate("/inventory")}
                        className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                    >
                        <ArrowLeft01Icon size={20} />
                        Back to Inventory
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>{item.name} | Inventory | Lookups Business</title>
                <meta name="description" content={`View details and history for ${item.name}`} />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/inventory")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ArrowLeft01Icon size={20} />
                        Back to Inventory
                    </button>

                    {/* Item Header */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <PackageIcon size={28} className="text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                                        {item.sku && <span>SKU: {item.sku}</span>}
                                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">{item.category}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        setModalError("");
                                        setModalData({ quantity: "", reason: "" });
                                        setShowRestockModal(true);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                >
                                    <ArrowUp01Icon size={18} />
                                    Restock
                                </button>
                                <button
                                    onClick={() => {
                                        setModalError("");
                                        setModalData({ quantity: "", reason: "" });
                                        setShowStockOutModal(true);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                >
                                    <ArrowDown01Icon size={18} />
                                    Stock Out
                                </button>
                                <button
                                    onClick={() => navigate(`/inventory`)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    <Edit02Icon size={18} />
                                    Edit
                                </button>
                            </div>
                        </div>

                        {item.description && (
                            <p className="mt-4 text-gray-600">{item.description}</p>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <PackageIcon size={16} />
                                Current Stock
                            </div>
                            <p className={`text-2xl font-bold ${item.quantity === 0
                                    ? "text-red-600"
                                    : item.quantity <= item.lowStockThreshold
                                        ? "text-amber-600"
                                        : "text-gray-900"
                                }`}>
                                {item.quantity} {item.unit}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <MoneyReceiveSquareIcon size={16} />
                                Stock Value
                            </div>
                            <p className="text-2xl font-bold text-emerald-600">
                                ₦{(item.stockValue || 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <ArrowUp01Icon size={16} />
                                Total Stock In
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                                +{item.totalStockIn || 0}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                <ArrowDown01Icon size={16} />
                                Total Stock Out
                            </div>
                            <p className="text-2xl font-bold text-red-600">
                                -{item.totalStockOut || 0}
                            </p>
                        </div>
                    </div>

                    {/* Pricing Info */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Cost Price</p>
                            <p className="text-xl font-bold text-gray-900">₦{item.costPrice?.toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Selling Price</p>
                            <p className="text-xl font-bold text-emerald-600">₦{item.sellingPrice?.toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <PercentIcon size={14} />
                                Profit Margin
                            </div>
                            <p className="text-xl font-bold text-blue-600">{item.profitMargin || 0}%</p>
                        </div>
                    </div>

                    {/* Stock History */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b flex items-center gap-2">
                            <Calendar03Icon size={20} className="text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-900">Stock History</h2>
                            <span className="ml-auto text-sm text-gray-500">
                                {item.stockHistory?.length || 0} entries
                            </span>
                        </div>

                        {!item.stockHistory || item.stockHistory.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <Calendar03Icon size={40} className="mx-auto mb-2 opacity-50" />
                                <p>No stock history yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Qty</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Reason</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Balance</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {item.stockHistory.map((entry, index) => (
                                            <tr key={entry._id || index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {formatDate(entry.createdAt)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {getTypeBadge(entry.type)}
                                                </td>
                                                <td className={`px-4 py-3 text-right text-sm font-medium ${entry.type === "in" ? "text-green-600" : "text-red-600"
                                                    }`}>
                                                    {entry.type === "in" ? "+" : ""}{entry.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {entry.reason || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                                    {entry.balanceAfter}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-600">
                                                    ₦{(entry.valueAfter || 0).toLocaleString()}
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

            {/* Restock Modal */}
            {showRestockModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ArrowUp01Icon size={24} className="text-green-600" />
                                Restock Item
                            </h2>
                            <button onClick={() => setShowRestockModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <Cancel01Icon size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleRestock} className="p-6">
                            {modalError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                                    <AlertCircleIcon size={18} />
                                    {modalError}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add *</label>
                                    <input
                                        type="number"
                                        value={modalData.quantity}
                                        onChange={(e) => setModalData({ ...modalData, quantity: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                                        placeholder="Enter quantity"
                                        min="1"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                                    <input
                                        type="text"
                                        value={modalData.reason}
                                        onChange={(e) => setModalData({ ...modalData, reason: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                                        placeholder="e.g., New shipment, Return from customer"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowRestockModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <Loading03Icon size={18} className="animate-spin" />
                                    ) : (
                                        <Tick02Icon size={18} />
                                    )}
                                    Add Stock
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stock Out Modal */}
            {showStockOutModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ArrowDown01Icon size={24} className="text-red-600" />
                                Stock Out
                            </h2>
                            <button onClick={() => setShowStockOutModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <Cancel01Icon size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleStockOut} className="p-6">
                            {modalError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                                    <AlertCircleIcon size={18} />
                                    {modalError}
                                </div>
                            )}
                            <p className="mb-4 text-sm text-gray-500">
                                Current stock: <span className="font-semibold text-gray-900">{item.quantity} {item.unit}</span>
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Remove *</label>
                                    <input
                                        type="number"
                                        value={modalData.quantity}
                                        onChange={(e) => setModalData({ ...modalData, quantity: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                                        placeholder="Enter quantity"
                                        min="1"
                                        max={item.quantity}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                                    <select
                                        value={modalData.reason}
                                        onChange={(e) => setModalData({ ...modalData, reason: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                                    >
                                        <option value="">Select a reason</option>
                                        <option value="Damaged">Damaged</option>
                                        <option value="Expired">Expired</option>
                                        <option value="Lost">Lost</option>
                                        <option value="Returned to Supplier">Returned to Supplier</option>
                                        <option value="Used internally">Used internally</option>
                                        <option value="Correction">Correction</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowStockOutModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <Loading03Icon size={18} className="animate-spin" />
                                    ) : (
                                        <Tick02Icon size={18} />
                                    )}
                                    Remove Stock
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
