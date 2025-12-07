import React, { useState, useEffect } from "react";
import { productApi } from "../api/productApi";
import {
    Cancel01Icon,
    PackageIcon,
    Loading03Icon,
    ArrowUp01Icon,
    ArrowDown01Icon,
    RefreshIcon,
    Clock01Icon,
} from "hugeicons-react";

export default function RestockModal({ product, isOpen, onClose, onSuccess }) {
    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setReason("");
            setError(null);
            setShowHistory(false);
            setHistory([]);
        }
    }, [isOpen]);

    const handleRestock = async (e) => {
        e.preventDefault();
        if (quantity < 1) {
            setError("Quantity must be at least 1");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const result = await productApi.restockProduct(product._id, quantity, reason);
            if (result.success) {
                onSuccess?.(result.product);
                onClose();
            }
        } catch (err) {
            setError(err.message || "Failed to restock product");
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            setHistoryLoading(true);
            const result = await productApi.getTransactionHistory(product._id, { limit: 10 });
            if (result.success) {
                setHistory(result.transactions);
            }
        } catch (err) {
            console.error("Failed to fetch history:", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const toggleHistory = () => {
        if (!showHistory && history.length === 0) {
            fetchHistory();
        }
        setShowHistory(!showHistory);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <PackageIcon size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Restock Product</h2>
                            <p className="text-sm text-gray-500 truncate max-w-[200px]">{product.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Cancel01Icon size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {/* Current Stock Display */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-gray-600">Current Stock</span>
                        <span className="text-lg font-bold text-gray-900">{product.stock} units</span>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRestock} className="space-y-4">
                        {/* Quantity Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity to Add
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="flex-1 h-10 text-center border border-gray-300 rounded-lg font-semibold"
                                    min="1"
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* New Stock Preview */}
                        <div className="p-3 bg-emerald-50 rounded-lg flex items-center justify-between">
                            <span className="text-sm text-emerald-700">New Stock After Restock</span>
                            <span className="text-lg font-bold text-emerald-600">
                                {product.stock + quantity} units
                            </span>
                        </div>

                        {/* Reason Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason (optional)
                            </label>
                            <input
                                type="text"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g., New shipment arrived"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loading03Icon size={20} className="animate-spin" />
                                    Restocking...
                                </>
                            ) : (
                                <>
                                    <ArrowUp01Icon size={20} />
                                    Restock +{quantity} Units
                                </>
                            )}
                        </button>
                    </form>

                    {/* Transaction History Toggle */}
                    <button
                        type="button"
                        onClick={toggleHistory}
                        className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
                    >
                        <Clock01Icon size={16} />
                        {showHistory ? "Hide" : "View"} Transaction History
                    </button>

                    {/* Transaction History */}
                    {showHistory && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                            {historyLoading ? (
                                <div className="flex justify-center py-4">
                                    <Loading03Icon size={24} className="animate-spin text-gray-400" />
                                </div>
                            ) : history.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No transaction history yet</p>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {history.map((tx, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                {tx.type === "restock" || tx.quantity > 0 ? (
                                                    <ArrowUp01Icon size={16} className="text-emerald-600" />
                                                ) : (
                                                    <ArrowDown01Icon size={16} className="text-red-500" />
                                                )}
                                                <div>
                                                    <span className="font-medium capitalize">{tx.type}</span>
                                                    {tx.reason && (
                                                        <p className="text-xs text-gray-500">{tx.reason}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`font-semibold ${tx.quantity > 0 ? "text-emerald-600" : "text-red-500"}`}>
                                                    {tx.quantity > 0 ? "+" : ""}{tx.quantity}
                                                </span>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(tx.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={fetchHistory}
                                className="mt-2 w-full py-1 text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
                            >
                                <RefreshIcon size={12} />
                                Refresh
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
