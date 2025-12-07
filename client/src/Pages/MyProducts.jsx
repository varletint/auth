import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import RestockModal from "../Components/RestockModal";
import useAuthStore from "../store/useAuthStore";
import {
    ShoppingBag01Icon,
    Add01Icon,
    Edit02Icon,
    Delete02Icon,
    Search01Icon,
    MoreVerticalIcon,
    Loading03Icon,
    ViewIcon,
    PackageIcon
} from "hugeicons-react";
import { productApi } from "../api/productApi";

export default function MyProducts() {
    const { currentUser } = useAuthStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [restockProduct, setRestockProduct] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchProducts();
        }
    }, [currentUser]);

    const fetchProducts = async (pageNum = 1, append = false) => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }
            // Fetch only the current user's products
            const data = await productApi.getProducts({
                limit: 10,
                page: pageNum,
                userId: currentUser._id || currentUser.id
            });
            const newProducts = data.products || [];

            if (append) {
                setProducts((prev) => [...prev, ...newProducts]);
            } else {
                setProducts(newProducts);
            }

            // Check if there are more products to load
            setHasMore(newProducts.length === 10);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, true);
    };

    const handleDelete = async (id) => {
        try {
            await productApi.deleteProduct(id);
            setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRestockSuccess = (updatedProduct) => {
        setProducts((prev) =>
            prev.map((p) =>
                (p._id || p.id) === updatedProduct.id
                    ? { ...p, stock: updatedProduct.stockAfter }
                    : p
            )
        );
    };

    return (
        <>
            <Helmet>
                <title>My Products | Lookups</title>
                <meta name="description" content="Manage your product listings." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <ShoppingBag01Icon size={32} className="text-emerald-600" />
                            <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
                            <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
                                {products.length} items
                            </span>
                        </div>
                        <Link to="/add-product">
                            <Button text="Add Product" className="flex items-center gap-2">
                                <Add01Icon size={18} />
                            </Button>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search01Icon
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your products..."
                            className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                                    <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product._id || product.id}
                                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="aspect-square bg-gray-100 relative">
                                            <img
                                                src={product.images?.[0] || "https://via.placeholder.com/300x200"}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <span
                                                className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold ${product.stock > 0
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                            </span>
                                        </div>
                                        <div className="p-2 flex justify-between w-full">
                                            <div className="">
                                                <Link to={`/product/${product._id || product.id}`}>
                                                    <h3 className="font-semibold text-xs text-gray-900 hover:text-emerald-600 transition-colors truncate">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-emerald-600 font-bold text-xs mt-0">
                                                    ₦{product.price?.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0">{product.category}</p>
                                                <div className="flex items-center gap-1 text-gray-400 text-[10px] mt-1">
                                                    <ViewIcon size={12} />
                                                    <span>{product.viewCount || 0}</span>
                                                </div>
                                            </div>
                                            {/* 3-dot Menu */}
                                            <div className="relative mt-0" ref={activeDropdown === (product._id || product.id) ? dropdownRef : null}>
                                                <button
                                                    onClick={() => setActiveDropdown(
                                                        activeDropdown === (product._id || product.id) ? null : (product._id || product.id)
                                                    )}
                                                    className="p-2 py-2 hover:bg-gray-100 rounded-full transition-colors ml-auto block"
                                                >
                                                    <MoreVerticalIcon size={25} className=" font-bold text-gray-600" />
                                                </button>
                                                {/*  */}
                                                {activeDropdown === (product._id || product.id) && (
                                                    <div className="absolute right-0 top-[-13px] bg-white rounded-lg 
                                                    shadow-lg border border-gray-100 py-1 z-100 min-w-[120px]">
                                                        <Link
                                                            to={`/edit-product/${product._id || product.id}`}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                            onClick={() => setActiveDropdown(null)}
                                                        >
                                                            <Edit02Icon size={16} className="text-blue-600" />
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                setRestockProduct(product);
                                                                setActiveDropdown(null);
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full"
                                                        >
                                                            <PackageIcon size={16} className="text-emerald-600" />
                                                            Restock
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setDeleteConfirm(product._id || product.id);
                                                                setActiveDropdown(null);
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full"
                                                        >
                                                            <Delete02Icon size={16} className="text-red-600" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {hasMore && !searchQuery && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loading03Icon size={20} className="animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            "Load More"
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <ShoppingBag01Icon size={80} className="text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">
                                {searchQuery ? "No products found" : "No products yet"}
                            </h2>
                            <p className="text-gray-500 mb-6">
                                {searchQuery
                                    ? "Try a different search term"
                                    : "Start selling by adding your first product!"}
                            </p>
                            {!searchQuery && (
                                <Link to="/add-product">
                                    <Button text="Add Your First Product" />
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
                        <p className="text-gray-500 mb-6">
                            This action cannot be undone. The product will be permanently removed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />

            {/* Restock Modal */}
            <RestockModal
                product={restockProduct}
                isOpen={!!restockProduct}
                onClose={() => setRestockProduct(null)}
                onSuccess={handleRestockSuccess}
            />
        </>
    );
}
