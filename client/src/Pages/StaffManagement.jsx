import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { staffApi } from "../api/staffApi";
import {
    UserMultiple02Icon,
    Add01Icon,
    Edit02Icon,
    Delete02Icon,
    Loading03Icon,
    CheckmarkCircle02Icon,
    Cancel01Icon,
    ArrowLeft02Icon,
    UserIcon,
    LockPasswordIcon,
    Search01Icon,
} from "hugeicons-react";

export default function StaffManagement() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        staff_name: "",
        password: "",
        role: "cashier",
        isActive: true,
    });

    const roles = [
        { value: "manager", label: "Manager", description: "Full access to all features" },
        { value: "cashier", label: "Cashier", description: "Sales and customer management" },
        { value: "inventory_clerk", label: "Inventory Clerk", description: "Inventory management only" },
    ];

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await staffApi.getAll();
            setStaff(response.staff || []);
        } catch (err) {
            setError(err.message || "Failed to load staff");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            if (editingStaff) {
                // Update existing staff
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password; // Don't send empty password
                await staffApi.update(editingStaff._id, updateData);
                setSuccess("Staff member updated successfully");
            } else {
                // Create new staff
                await staffApi.register(formData);
                setSuccess("Staff member added successfully");
            }

            setShowModal(false);
            setEditingStaff(null);
            setFormData({ staff_name: "", password: "", role: "cashier", isActive: true });
            fetchStaff();
        } catch (err) {
            setError(err.message || "Failed to save staff member");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (staffMember) => {
        setEditingStaff(staffMember);
        setFormData({
            staff_name: staffMember.staff_name,
            password: "",
            role: staffMember.role,
            isActive: staffMember.isActive,
        });
        setShowModal(true);
        setError("");
        setSuccess("");
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this staff member?")) return;

        try {
            await staffApi.delete(id);
            setSuccess("Staff member deleted successfully");
            fetchStaff();
        } catch (err) {
            setError(err.message || "Failed to delete staff member");
        }
    };

    const handleToggleActive = async (staffMember) => {
        try {
            await staffApi.update(staffMember._id, { isActive: !staffMember.isActive });
            setSuccess(`Staff member ${staffMember.isActive ? "deactivated" : "activated"}`);
            fetchStaff();
        } catch (err) {
            setError(err.message || "Failed to update staff status");
        }
    };

    const openAddModal = () => {
        setEditingStaff(null);
        setFormData({ staff_name: "", password: "", role: "cashier", isActive: true });
        setShowModal(true);
        setError("");
        setSuccess("");
    };

    const filteredStaff = staff.filter((s) =>
        s.staff_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadgeColor = (role) => {
        const colors = {
            manager: "bg-purple-100 text-purple-800",
            cashier: "bg-emerald-100 text-emerald-800",
            inventory_clerk: "bg-blue-100 text-blue-800",
        };
        return colors[role] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <Loading03Icon size={40} className="text-emerald-600 animate-spin" />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Staff Management | Lookups</title>
                <meta name="description" content="Manage your business staff members" />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Link
                                to="/biz-dashboard"
                                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <ArrowLeft02Icon size={24} className="text-gray-600" />
                            </Link>
                            <div className="flex items-center gap-3">
                                <UserMultiple02Icon size={28} className="text-emerald-600" />
                                <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                            </div>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            <Add01Icon size={20} />
                            Add Staff
                        </button>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                            <Cancel01Icon size={20} />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2">
                            <CheckmarkCircle02Icon size={20} />
                            {success}
                        </div>
                    )}

                    {/* Search */}
                    <div className="relative mb-6">
                        <Search01Icon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search staff by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>

                    {/* Staff List */}
                    {filteredStaff.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <UserMultiple02Icon size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
                            <p className="text-gray-500 mb-4">Add your first staff member to get started</p>
                            <button
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                <Add01Icon size={20} />
                                Add Staff
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Staff Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Login</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredStaff.map((staffMember) => (
                                            <tr key={staffMember._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <UserIcon size={20} className="text-gray-500" />
                                                        </div>
                                                        <span className="font-medium text-gray-900 capitalize">
                                                            {staffMember.staff_name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(staffMember.role)}`}>
                                                        {staffMember.role.replace("_", " ")}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleToggleActive(staffMember)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${staffMember.isActive
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {staffMember.isActive ? "Active" : "Inactive"}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {staffMember.lastLogin
                                                        ? new Date(staffMember.lastLogin).toLocaleDateString()
                                                        : "Never"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(staffMember)}
                                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit02Icon size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(staffMember._id)}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingStaff ? "Edit Staff Member" : "Add New Staff"}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Staff Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Staff Name
                                </label>
                                <div className="relative">
                                    <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.staff_name}
                                        onChange={(e) => setFormData({ ...formData, staff_name: e.target.value })}
                                        placeholder="Enter staff name"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {editingStaff && <span className="text-gray-400">(leave blank to keep current)</span>}
                                </label>
                                <div className="relative">
                                    <LockPasswordIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={editingStaff ? "Enter new password" : "Enter password"}
                                        required={!editingStaff}
                                        minLength={6}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <div className="space-y-2">
                                    {roles.map((role) => (
                                        <label
                                            key={role.value}
                                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${formData.role === role.value
                                                ? "border-emerald-500 bg-emerald-50"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role.value}
                                                checked={formData.role === role.value}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">{role.label}</div>
                                                <div className="text-xs text-gray-500">{role.description}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loading03Icon size={18} className="animate-spin" />}
                                    {editingStaff ? "Update" : "Add Staff"}
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
