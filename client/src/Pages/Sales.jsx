import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { salesApi } from "../api/salesApi";
import { inventoryApi } from "../api/inventoryApi";
import { customerApi } from "../api/customerApi";
import {
    MoneyBag01Icon,
    Add01Icon,
    Search01Icon,
    Loading03Icon,
    Cancel01Icon,
    Tick02Icon,
    AlertCircleIcon,
    Calendar03Icon,
    Delete02Icon,
    Invoice02Icon,
    UserIcon,
    CreditCardIcon,
    PrinterIcon,
    Clock01Icon,
} from "hugeicons-react";

export default function Sales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState(null);
    const [period, setPeriod] = useState("today");
    const [inventoryItems, setInventoryItems] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);

    const [formData, setFormData] = useState({
        items: [{ name: "", quantity: 1, unitPrice: "", inventoryItem: "" }],
        customerName: "Walk-in Customer",
        customer: "",
        paymentMethod: "cash",
        paymentStatus: "paid",
        notes: "",
    });
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSales();
        fetchStats();
        fetchInventory();
        fetchCustomers();
    }, []);

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchSales = async () => {
        try {
            setLoading(true);
            const data = await salesApi.getSales({ limit: 50 });
            setSales(data.sales || []);
        } catch (error) {
            console.error("Error fetching sales:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await salesApi.getStats(period);
            setStats(data.stats);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchInventory = async () => {
        try {
            const data = await inventoryApi.getItems({ limit: 100 });
            setInventoryItems(data.items || []);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const data = await customerApi.getCustomers({ limit: 100 });
            setCustomers(data.customers || []);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const openAddModal = () => {
        setFormData({
            items: [{ name: "", quantity: 1, unitPrice: "", inventoryItem: "" }],
            customerName: "Walk-in Customer",
            customer: "",
            paymentMethod: "cash",
            paymentStatus: "paid",
            notes: "",
        });
        setFormError("");
        setShowModal(true);
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { name: "", quantity: 1, unitPrice: "", inventoryItem: "" }],
        });
    };

    const removeItem = (index) => {
        if (formData.items.length === 1) return;
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        // Auto-fill price if inventory item selected
        if (field === "inventoryItem" && value) {
            const invItem = inventoryItems.find((i) => i._id === value);
            if (invItem) {
                newItems[index].name = invItem.name;
                newItems[index].unitPrice = invItem.sellingPrice.toString();
            }
        }

        setFormData({ ...formData, items: newItems });
    };

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => {
            return sum + (parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 0);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        const validItems = formData.items.filter((item) => item.name && item.unitPrice);
        if (validItems.length === 0) {
            setFormError("Add at least one item with name and price");
            return;
        }

        setSubmitting(true);
        try {
            const saleData = {
                items: validItems.map((item) => ({
                    ...item,
                    quantity: parseInt(item.quantity) || 1,
                    unitPrice: parseFloat(item.unitPrice),
                    inventoryItem: item.inventoryItem || undefined,
                })),
                customerName: formData.customerName,
                customer: formData.customer || undefined,
                totalAmount: calculateTotal(),
                paymentMethod: formData.paymentMethod,
                paymentStatus: formData.paymentStatus,
                notes: formData.notes,
            };

            await salesApi.createSale(saleData);
            setShowModal(false);
            fetchSales();
            fetchStats();
            fetchInventory(); // Refresh inventory after sale
        } catch (error) {
            setFormError(error.message || "Failed to record sale");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this sale? Inventory will be restored.")) return;
        try {
            await salesApi.deleteSale(id);
            fetchSales();
            fetchStats();
            fetchInventory();
        } catch (error) {
            alert(error.message || "Failed to delete sale");
        }
    };

    return (
        <>
            <Helmet>
                <title>Sales | Lookups Business</title>
                <meta name="description" content="Record and track your sales" />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <MoneyBag01Icon size={32} className="text-emerald-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                to="/biz/sales-history"
                                className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                <Clock01Icon size={20} />
                                History
                            </Link>
                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                <Add01Icon size={20} />
                                Record Sale
                            </button>
                        </div>
                    </div>

                    {/* Period Selector */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {["today", "week", "month", "year"].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${period === p ? "bg-emerald-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {p === "today" ? "Today" : `This ${p}`}
                            </button>
                        ))}
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Total Sales</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Revenue</p>
                                <p className="text-2xl font-bold text-emerald-600">₦{stats.totalRevenue?.toLocaleString()}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Profit</p>
                                <p className="text-2xl font-bold text-blue-600">₦{stats.totalProfit?.toLocaleString()}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Margin</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.profitMargin}%</p>
                            </div>
                        </div>
                    )}

                    {/* Sales List */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loading03Icon size={40} className="text-emerald-600 animate-spin" />
                            </div>
                        ) : sales.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <MoneyBag01Icon size={48} className="mb-4 opacity-50" />
                                <p>No sales recorded yet</p>
                                <button onClick={openAddModal} className="mt-4 text-emerald-600 font-semibold hover:underline">
                                    Record your first sale
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {sales.map((sale) => (
                                    <div
                                        key={sale._id}
                                        className="p-4 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setSelectedSale(sale)}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-gray-900">{sale.referenceNumber}</span>
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-full ${sale.paymentStatus === "paid"
                                                            ? "bg-green-100 text-green-700"
                                                            : sale.paymentStatus === "pending"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-blue-100 text-blue-700"
                                                            }`}
                                                    >
                                                        {sale.paymentStatus}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">{sale.customerName}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {sale.itemCount} items • {new Date(sale.saleDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-emerald-600">₦{sale.totalAmount?.toLocaleString()}</p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(sale._id);
                                                    }}
                                                    className="text-red-500 hover:text-red-600 mt-1"
                                                >
                                                    <Delete02Icon size={16} />
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

            {/* Add Sale Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">Record New Sale</h2>
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
                                {/* Items */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <select
                                                value={item.inventoryItem}
                                                onChange={(e) => updateItem(index, "inventoryItem", e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            >
                                                <option value="">Select or type item</option>
                                                {inventoryItems.map((inv) => (
                                                    <option key={inv._id} value={inv._id}>
                                                        {inv.name} (₦{inv.sellingPrice?.toLocaleString()})
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                                className="w-16 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                                                min="1"
                                                placeholder="Qty"
                                            />
                                            <input
                                                type="number"
                                                value={item.unitPrice}
                                                onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                                                className="w-24 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                                                placeholder="Price"
                                            />
                                            {formData.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Cancel01Icon size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-sm text-emerald-600 font-medium hover:underline"
                                    >
                                        + Add another item
                                    </button>
                                </div>

                                {/* Customer */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                                    <select
                                        value={formData.customer}
                                        onChange={(e) => {
                                            const cust = customers.find((c) => c._id === e.target.value);
                                            setFormData({
                                                ...formData,
                                                customer: e.target.value,
                                                customerName: cust?.name || "Walk-in Customer",
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                    >
                                        <option value="">Walk-in Customer</option>
                                        {customers.map((c) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Payment */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                        <select
                                            value={formData.paymentMethod}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        >
                                            <option value="cash">Cash</option>
                                            <option value="transfer">Transfer</option>
                                            <option value="card">Card</option>
                                            <option value="credit">Credit</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={formData.paymentStatus}
                                            onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        >
                                            <option value="paid">Paid</option>
                                            <option value="pending">Pending</option>
                                            <option value="partial">Partial</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-3xl font-bold text-emerald-600">₦{calculateTotal().toLocaleString()}</p>
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
                                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <Loading03Icon size={18} className="animate-spin" />
                                    ) : (
                                        <Tick02Icon size={18} />
                                    )}
                                    Record Sale
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sale Detail Modal (Receipt) */}
            {selectedSale && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Receipt Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Invoice02Icon size={28} />
                                    <div>
                                        <h2 className="text-lg font-bold">Sale Receipt</h2>
                                        <p className="text-emerald-100 text-sm">{selectedSale.referenceNumber}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedSale(null)}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <Cancel01Icon size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Receipt Body */}
                        <div className="p-6">
                            {/* Date & Customer */}
                            <div className="flex justify-between items-start mb-6 pb-4 border-b border-dashed">
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                        <Calendar03Icon size={14} />
                                        Date
                                    </div>
                                    <p className="font-medium">
                                        {new Date(selectedSale.saleDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 justify-end">
                                        <UserIcon size={14} />
                                        Customer
                                    </div>
                                    <p className="font-medium">{selectedSale.customerName}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Items</h3>
                                <div className="space-y-3">
                                    {selectedSale.items?.map((item, index) => (
                                        <div key={index} className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {item.quantity} × ₦{item.unitPrice?.toLocaleString()}
                                                </p>
                                            </div>
                                            <p className="font-medium text-gray-900">
                                                ₦{item.subtotal?.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="border-t border-dashed pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium">₦{selectedSale.totalAmount?.toLocaleString()}</span>
                                </div>
                                {selectedSale.totalCost > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Cost</span>
                                        <span className="text-gray-600">₦{selectedSale.totalCost?.toLocaleString()}</span>
                                    </div>
                                )}
                                {selectedSale.profit > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Profit</span>
                                        <span className="text-green-600 font-medium">₦{selectedSale.profit?.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                    <span>Total</span>
                                    <span className="text-emerald-600">₦{selectedSale.totalAmount?.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <CreditCardIcon size={18} className="text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Payment Details</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Method</p>
                                        <p className="font-medium capitalize">{selectedSale.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Status</p>
                                        <span
                                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${selectedSale.paymentStatus === "paid"
                                                ? "bg-green-100 text-green-700"
                                                : selectedSale.paymentStatus === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {selectedSale.paymentStatus}
                                        </span>
                                    </div>
                                    {selectedSale.paymentStatus !== "paid" && (
                                        <>
                                            <div>
                                                <p className="text-gray-500">Paid</p>
                                                <p className="font-medium">₦{selectedSale.amountPaid?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Balance</p>
                                                <p className="font-medium text-red-600">₦{selectedSale.balance?.toLocaleString()}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedSale.notes && (
                                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                                    <p className="text-sm text-yellow-800">{selectedSale.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t flex gap-3">
                            <button
                                onClick={() => setSelectedSale(null)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(selectedSale._id);
                                    setSelectedSale(null);
                                }}
                                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            >
                                <Delete02Icon size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
