import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { expensesApi } from "../api/expensesApi";
import {
    Invoice02Icon,
    Add01Icon,
    Loading03Icon,
    Cancel01Icon,
    Tick02Icon,
    AlertCircleIcon,
    Edit02Icon,
    Delete02Icon,
} from "hugeicons-react";

const EXPENSE_CATEGORIES = [
    { value: "rent", label: "Rent" },
    { value: "utilities", label: "Utilities" },
    { value: "salaries", label: "Salaries" },
    { value: "inventory", label: "Inventory/Stock" },
    { value: "transport", label: "Transport" },
    { value: "marketing", label: "Marketing" },
    { value: "equipment", label: "Equipment" },
    { value: "maintenance", label: "Maintenance" },
    { value: "taxes", label: "Taxes" },
    { value: "supplies", label: "Supplies" },
    { value: "other", label: "Other" },
];

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [stats, setStats] = useState(null);
    const [period, setPeriod] = useState("month");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "other",
        amount: "",
        expenseDate: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
    });
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchExpenses();
        fetchStats();
    }, []);

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const data = await expensesApi.getExpenses({ limit: 50 });
            setExpenses(data.expenses || []);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await expensesApi.getStats(period);
            setStats(data.stats);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const openAddModal = () => {
        setEditingExpense(null);
        setFormData({
            title: "",
            description: "",
            category: "other",
            amount: "",
            expenseDate: new Date().toISOString().split("T")[0],
            paymentMethod: "cash",
        });
        setFormError("");
        setShowModal(true);
    };

    const openEditModal = (expense) => {
        setEditingExpense(expense);
        setFormData({
            title: expense.title,
            description: expense.description || "",
            category: expense.category,
            amount: expense.amount?.toString() || "",
            expenseDate: new Date(expense.expenseDate).toISOString().split("T")[0],
            paymentMethod: expense.paymentMethod || "cash",
        });
        setFormError("");
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.title || !formData.amount) {
            setFormError("Title and amount are required");
            return;
        }

        setSubmitting(true);
        try {
            const expenseData = {
                ...formData,
                amount: parseFloat(formData.amount),
            };

            if (editingExpense) {
                await expensesApi.updateExpense(editingExpense._id, expenseData);
            } else {
                await expensesApi.createExpense(expenseData);
            }

            setShowModal(false);
            fetchExpenses();
            fetchStats();
        } catch (error) {
            setFormError(error.message || "Failed to save expense");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this expense?")) return;
        try {
            await expensesApi.deleteExpense(id);
            fetchExpenses();
            fetchStats();
        } catch (error) {
            alert(error.message || "Failed to delete");
        }
    };

    const getCategoryLabel = (value) => {
        return EXPENSE_CATEGORIES.find((c) => c.value === value)?.label || value;
    };

    return (
        <>
            <Helmet>
                <title>Expenses | Lookups Business</title>
                <meta name="description" content="Track your business expenses" />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Invoice02Icon size={32} className="text-red-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                            <Add01Icon size={20} />
                            Add Expense
                        </button>
                    </div>

                    {/* Period Selector */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {["today", "week", "month", "year"].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${period === p ? "bg-red-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {p === "today" ? "Today" : `This ${p}`}
                            </button>
                        ))}
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Total Expenses</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalExpenses}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm md:col-span-2">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-2xl font-bold text-red-600">₦{stats.totalAmount?.toLocaleString()}</p>
                            </div>
                        </div>
                    )}

                    {/* Top Categories */}
                    {stats?.topCategories && stats.topCategories.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Top Categories</h3>
                            <div className="flex flex-wrap gap-2">
                                {stats.topCategories.map((cat) => (
                                    <div
                                        key={cat.category}
                                        className="px-3 py-2 bg-gray-100 rounded-lg text-sm"
                                    >
                                        <span className="font-medium capitalize">{getCategoryLabel(cat.category)}</span>
                                        <span className="text-red-600 ml-2">₦{cat.amount?.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Expenses List */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loading03Icon size={40} className="text-red-600 animate-spin" />
                            </div>
                        ) : expenses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Invoice02Icon size={48} className="mb-4 opacity-50" />
                                <p>No expenses recorded</p>
                                <button onClick={openAddModal} className="mt-4 text-red-600 font-semibold hover:underline">
                                    Add your first expense
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {expenses.map((expense) => (
                                    <div key={expense._id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-gray-900">{expense.title}</span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                                                    {getCategoryLabel(expense.category)}
                                                </span>
                                            </div>
                                            {expense.description && (
                                                <p className="text-sm text-gray-500">{expense.description}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(expense.expenseDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-red-600">₦{expense.amount?.toLocaleString()}</span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => openEditModal(expense)}
                                                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                                                >
                                                    <Edit02Icon size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense._id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
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

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">{editingExpense ? "Edit Expense" : "Add Expense"}</h2>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        placeholder="e.g., Electricity bill"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                                        <input
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        >
                                            {EXPENSE_CATEGORIES.map((cat) => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={formData.expenseDate}
                                            onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        />
                                    </div>
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
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        rows={2}
                                        placeholder="Optional notes..."
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
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loading03Icon size={18} className="animate-spin" /> : <Tick02Icon size={18} />}
                                    {editingExpense ? "Update" : "Add Expense"}
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
