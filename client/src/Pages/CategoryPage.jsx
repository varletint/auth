import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SEOHead from "../Components/SEOHead";
import { generateCategorySchema } from "../Components/ProductSchema";
import Footer from "../Components/Footer";
import {
    ArrowLeft01Icon,
    Loading03Icon,
    GridViewIcon,
    FilterIcon
} from "hugeicons-react";

export default function CategoryPage() {
    const { categorySlug } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const BASE_URL = 'https://lookupsbackend.vercel.app';

    const fetchCategoryProducts = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${BASE_URL}/api/seo/category/${categorySlug}?page=${page}&limit=20`
            );

            if (!response.ok) {
                throw new Error("Category not found");
            }

            const data = await response.json();
            console.log('SEO Category API Response:', data); // Debug log
            setCategory(data.category || null);
            setProducts(data.products || []);
            setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [categorySlug]);

    useEffect(() => {
        fetchCategoryProducts();
    }, [fetchCategoryProducts]);

    const handlePageChange = (newPage) => {
        fetchCategoryProducts(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const structuredData = category
        ? generateCategorySchema(category.name, category.productCount)
        : null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white">
                <Loading03Icon size={48} className="text-emerald-600 animate-spin" />
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The category you're looking for doesn't exist."}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEOHead
                title={`${category.name} Products`}
                description={`Browse ${category.productCount} products in ${category.name}. Find the best deals on Lookups.`}
                url={`/category/${categorySlug}`}
                type="website"
                structuredData={structuredData}
            />

            <div className="min-h-screen bg-off-white">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft01Icon size={20} />
                                <span className="font-medium">Back</span>
                            </button>
                            <div className="flex items-center gap-2">
                                <GridViewIcon size={20} className="text-gray-400" />
                                <span className="text-sm text-gray-600">{category.productCount} products</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <nav className="text-sm mb-2 text-emerald-100">
                            <Link to="/" className="hover:underline">Home</Link>
                            <span className="mx-2">/</span>
                            <Link to="/categories" className="hover:underline">Categories</Link>
                            <span className="mx-2">/</span>
                            <span>{category.name}</span>
                        </nav>
                        <h1 className="text-3xl font-bold">{category.name}</h1>
                        <p className="text-emerald-100 mt-2">
                            Explore {category.productCount} products in this category
                        </p>
                    </div>
                </div>


                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {products.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No products found in this category.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <Link
                                        key={product._id}
                                        to={product.userId?.username
                                            ? `/${product.userId.username}/${product.slug}`
                                            : `/product/${product._id}`
                                        }
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all"
                                    >
                                        <div className="aspect-square overflow-hidden bg-gray-100">
                                            <img
                                                src={product.images?.[0] || "https://via.placeholder.com/400"}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-emerald-600 font-bold mt-1">
                                                {new Intl.NumberFormat('en-NG', {
                                                    style: 'currency',
                                                    currency: 'NGN'
                                                }).format(product.price)}
                                            </p>
                                            {product.stock > 0 ? (
                                                <span className="text-xs text-green-600">In Stock</span>
                                            ) : (
                                                <span className="text-xs text-red-500">Out of Stock</span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2 text-gray-600">
                                        Page {pagination.page} of {pagination.pages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.pages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
