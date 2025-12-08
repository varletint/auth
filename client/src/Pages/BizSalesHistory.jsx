import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { salesApi } from "../api/salesApi";
import * as XLSX from "xlsx";
import {
    Clock01Icon,
    ArrowLeft01Icon,
    Search01Icon,
    Loading03Icon,
    Calendar03Icon,
    MoneyBag01Icon,
    FilterIcon,
    FileDownloadIcon,
    ArrowDown01Icon,
} from "hugeicons-react";

export default function BizSalesHistory() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Date filters
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Stats
    const [totals, setTotals] = useState({ count: 0, revenue: 0, profit: 0 });

    // Expanded row
    const [expandedSale, setExpandedSale] = useState(null);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            setLoading(true);
            setError("");

            const params = { limit: 100 };
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const data = await salesApi.getSales(params);
            const salesList = data.sales || [];
            setSales(salesList);

            // Calculate totals
            const totalRevenue = salesList.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
            const totalProfit = salesList.reduce((sum, s) => sum + (s.profit || 0), 0);
            setTotals({
                count: salesList.length,
                revenue: totalRevenue,
                profit: totalProfit,
            });
        } catch (err) {
            setError(err.message || "Failed to load sales history");
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchSales();
    };

    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
        setSearchQuery("");
        fetchSales();
    };

    // Filter sales by search query (client-side)
    const filteredSales = sales.filter((sale) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            sale.referenceNumber?.toLowerCase().includes(query) ||
            sale.customerName?.toLowerCase().includes(query)
        );
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Excel export function - one row per item
    const exportToExcel = () => {
        // Flatten: each item in each sale becomes its own row
        const excelData = [];

        filteredSales.forEach((sale) => {
            if (sale.items && sale.items.length > 0) {
                sale.items.forEach((item) => {
                    excelData.push({
                        Date: formatDate(sale.saleDate),
                        Reference: sale.referenceNumber,
                        Customer: sale.customerName,
                        "Item Name": item.name,
                        Quantity: item.quantity,
                        "Unit Price": item.unitPrice,
                        Subtotal: item.subtotal || item.quantity * item.unitPrice,
                        "Sale Total": sale.totalAmount,
                        "Payment Method": sale.paymentMethod,
                        Status: sale.paymentStatus,
                    });
                });
            } else {
                // Sale without items array (fallback)
                excelData.push({
                    Date: formatDate(sale.saleDate),
                    Reference: sale.referenceNumber,
                    Customer: sale.customerName,
                    "Item Name": "-",
                    Quantity: sale.itemCount || 0,
                    "Unit Price": "-",
                    Subtotal: "-",
                    "Sale Total": sale.totalAmount,
                    "Payment Method": sale.paymentMethod,
                    Status: sale.paymentStatus,
                });
            }
        });

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        worksheet["!cols"] = [
            { wch: 12 }, // Date
            { wch: 15 }, // Reference
            { wch: 20 }, // Customer
            { wch: 25 }, // Item Name
            { wch: 8 },  // Quantity
            { wch: 12 }, // Unit Price
            { wch: 12 }, // Subtotal
            { wch: 12 }, // Sale Total
            { wch: 15 }, // Payment Method
            { wch: 10 }, // Status
        ];

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

        // Generate filename with date
        const today = new Date().toISOString().split("T")[0];
        const filename = `Sales_History_${today}.xlsx`;

        // Download
        XLSX.writeFile(workbook, filename);
    };

    return (
        <>
            <Helmet>
                <title>Sales History | Lookups Business</title>
                <meta name="description" content="View your complete sales history" />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Link
                                to="/sales"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft01Icon size={20} />
                            </Link>
                            <Clock01Icon size={28} className="text-emerald-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Sales History</h1>
                        </div>
                        <button
                            onClick={exportToExcel}
                            disabled={filteredSales.length === 0}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileDownloadIcon size={18} />
                            Export to Excel
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search01Icon
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Reference or customer..."
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    From
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    To
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700"
                            >
                                <FilterIcon size={18} />
                                Filter
                            </button>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Clear
                            </button>
                        </form>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Total Sales</p>
                            <p className="text-2xl font-bold text-gray-900">{totals.count}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Revenue</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                ₦{totals.revenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Profit</p>
                            <p className="text-2xl font-bold text-blue-600">
                                ₦{totals.profit.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Sales Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center py-16">
                                <Loading03Icon size={40} className="animate-spin text-emerald-600" />
                            </div>
                        ) : error ? (
                            <div className="p-8 text-center text-red-600">{error}</div>
                        ) : filteredSales.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <MoneyBag01Icon size={48} className="mx-auto mb-3 opacity-50" />
                                <p>No sales found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                                Reference
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                                Customer
                                            </th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                                                Items
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredSales.map((sale) => (
                                            <React.Fragment key={sale._id}>
                                                <tr
                                                    className="hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => setExpandedSale(expandedSale === sale._id ? null : sale._id)}
                                                >
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <ArrowDown01Icon
                                                                size={16}
                                                                className={`text-gray-400 transition-transform ${expandedSale === sale._id ? "rotate-180" : ""}`}
                                                            />
                                                            {formatDate(sale.saleDate)}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-medium text-gray-900">
                                                            {sale.referenceNumber}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {sale.customerName}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                                                        {sale.itemCount}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium text-emerald-600">
                                                        ₦{sale.totalAmount?.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span
                                                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sale.paymentStatus === "paid"
                                                                ? "bg-green-100 text-green-700"
                                                                : sale.paymentStatus === "pending"
                                                                    ? "bg-yellow-100 text-yellow-700"
                                                                    : "bg-blue-100 text-blue-700"
                                                                }`}
                                                        >
                                                            {sale.paymentStatus}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {/* Expanded items row */}
                                                {expandedSale === sale._id && sale.items && sale.items.length > 0 && (
                                                    <tr className="bg-gray-50">
                                                        <td colSpan="6" className="px-4 py-3">
                                                            <div className="pl-6">
                                                                <p className="text-sm font-semibold text-gray-500 mb-2">Items:</p>
                                                                <div className="space-y-1">
                                                                    {sale.items.map((item, idx) => (
                                                                        <div key={idx} className="flex justify-between text-sm">
                                                                            <span className="text-gray-700">
                                                                                {item.name} <span className="text-gray-400">×{item.quantity}</span>
                                                                            </span>
                                                                            <span className="text-gray-600">
                                                                                @₦{item.unitPrice?.toLocaleString()} = <span className="font-medium text-gray-900">₦{(item.subtotal || item.quantity * item.unitPrice)?.toLocaleString()}</span>
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Results count */}
                    {!loading && filteredSales.length > 0 && (
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Showing {filteredSales.length} of {sales.length} sales
                        </p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
