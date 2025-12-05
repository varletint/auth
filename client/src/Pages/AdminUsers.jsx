import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import useAuthStore from "../store/useAuthStore";
import { apiCall } from "../api/api";
import {
    UserMultiple02Icon,
    ArrowLeft02Icon,
    Search01Icon,
    Loading03Icon,
    Delete02Icon,
    CheckmarkCircle02Icon,
    Cancel01Icon,
    UserIcon,
    Store04Icon,
    DashboardSquare01Icon,
} from "hugeicons-react";

export default function AdminUsers() {
    const navigate = useNavigate();
    const { currentUser } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const isAdmin = currentUser?.role?.includes("admin");

    useEffect(() => {
        if (!currentUser || !isAdmin) {
            navigate("/dashboard");
            return;
        }
        fetchUsers();
    }, [currentUser, isAdmin, page]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await apiCall(`/admin/users?page=${page}&limit=20`, { method: "GET" });
            if (response.success) {
                setUsers(response.users);
                setPagination(response.pagination);
            }
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, role, action) => {
        try {
            setActionLoading(`${userId}-${role}`);
            const response = await apiCall(`/admin/users/${userId}/role`, { method: "PATCH", body: JSON.stringify({ role, action }) });
            if (response.success) {
                setUsers(users.map(u =>
                    u._id === userId ? { ...u, role: response.user.role } : u
                ));
            }
        } catch (err) {
            alert(err.message || "Failed to update role");
        } finally {
            setActionLoading(null);
        }
    };

    const handleStatusChange = async (userId, status) => {
        try {
            setActionLoading(`${userId}-status`);
            const response = await apiCall(`/admin/users/${userId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
            if (response.success) {
                setUsers(users.map(u =>
                    u._id === userId ? { ...u, accountStatus: response.user.accountStatus } : u
                ));
            }
        } catch (err) {
            alert(err.message || "Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (userId) => {
        try {
            setActionLoading(`${userId}-delete`);
            const response = await apiCall(`/admin/users/${userId}`, { method: "DELETE" });
            if (response.success) {
                setUsers(users.filter(u => u._id !== userId));
                setDeleteConfirm(null);
            }
        } catch (err) {
            alert(err.message || "Failed to delete user");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadge = (role) => {
        if (role.includes("admin")) return { color: "bg-red-100 text-red-700", icon: DashboardSquare01Icon };
        if (role.includes("seller")) return { color: "bg-purple-100 text-purple-700", icon: Store04Icon };
        return { color: "bg-blue-100 text-blue-700", icon: UserIcon };
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "active": return "bg-emerald-100 text-emerald-700";
            case "suspended": return "bg-yellow-100 text-yellow-700";
            case "deactivated": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <>
            <Helmet>
                <title>User Management | Admin</title>
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft02Icon size={24} className="text-gray-600" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <UserMultiple02Icon size={32} className="text-blue-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                                <p className="text-gray-500">{pagination?.totalUsers || 0} total users</p>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-6">
                        <Search01Icon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                    </div>

                    {/* Users Table */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loading03Icon size={40} className="text-blue-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">User</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Roles</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredUsers.map((user) => {
                                            const badge = getRoleBadge(user.role);
                                            return (
                                                <tr key={user._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                                <UserIcon size={20} className="text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{user.fullname || user.username}</p>
                                                                <p className="text-sm text-gray-500">{user.email || user.phone_no}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {user.role.map((r) => (
                                                                <span
                                                                    key={r}
                                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadge([r]).color}`}
                                                                >
                                                                    {r}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        {/* Role toggles */}
                                                        {!user.role.includes("admin") && (
                                                            <div className="flex gap-2 mt-2">
                                                                <button
                                                                    onClick={() => handleRoleChange(
                                                                        user._id,
                                                                        "seller",
                                                                        user.role.includes("seller") ? "remove" : "add"
                                                                    )}
                                                                    disabled={actionLoading === `${user._id}-seller`}
                                                                    className={`text-xs px-2 py-1 rounded ${user.role.includes("seller")
                                                                        ? "bg-purple-600 text-white"
                                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                                        }`}
                                                                >
                                                                    {user.role.includes("seller") ? "- Seller" : "+ Seller"}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(user.accountStatus)}`}>
                                                            {user.accountStatus || "active"}
                                                        </span>
                                                        {!user.role.includes("admin") && (
                                                            <div className="flex gap-1 mt-2">
                                                                <button
                                                                    onClick={() => handleStatusChange(user._id, "active")}
                                                                    disabled={actionLoading === `${user._id}-status`}
                                                                    className={`p-1 rounded ${user.accountStatus === "active" ? "bg-emerald-100" : "hover:bg-gray-100"}`}
                                                                    title="Activate"
                                                                >
                                                                    <CheckmarkCircle02Icon size={16} className="text-emerald-600" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(user._id, "suspended")}
                                                                    disabled={actionLoading === `${user._id}-status`}
                                                                    className={`p-1 rounded ${user.accountStatus === "suspended" ? "bg-yellow-100" : "hover:bg-gray-100"}`}
                                                                    title="Suspend"
                                                                >
                                                                    <Cancel01Icon size={16} className="text-yellow-600" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {!user.role.includes("admin") && (
                                                            <button
                                                                onClick={() => setDeleteConfirm(user._id)}
                                                                className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                                                                title="Delete user"
                                                            >
                                                                <Delete02Icon size={18} />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex justify-center gap-2 p-4 border-t">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`px-4 py-2 rounded-lg ${page === i + 1
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h3>
                        <p className="text-gray-500 mb-6">
                            This will permanently delete the user and all their products.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={actionLoading === `${deleteConfirm}-delete`}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                            >
                                {actionLoading === `${deleteConfirm}-delete` ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
