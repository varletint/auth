import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SEOHead from "../Components/SEOHead";
import { generateSellerSchema } from "../Components/ProductSchema";
import Footer from "../Components/Footer";
import {
    ArrowLeft01Icon,
    Loading03Icon,
    Store01Icon,
    Calendar01Icon,
    Mail01Icon,
    CallIcon
} from "hugeicons-react";

export default function SellerStorePage() {
    const { username } = useParams();
    const navigate = useNavigate();

    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const BASE_URL = 'https://lookupsbackend.vercel.app';

    useEffect(() => {
        fetchSellerProfile();
    }, [username]);

    const fetchSellerProfile = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${BASE_URL}/api/seo/seller/${username}?page=${page}&limit=20`
            );

            if (!response.ok) {
                throw new Error("Seller not found");
            }

            const data = await response.json();
            setSeller(data.seller);
            setProducts(data.products);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchSellerProfile(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // SEO structured data
    const structuredData = seller ? generateSellerSchema(seller) : null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white">
                <Loading03Icon size={48} className="text-emerald-600 animate-spin" />
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The store you're looking for doesn't exist."}</p>
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
                title={`${seller.fullname || seller.username}'s Store`}
                description={`Shop ${seller.productCount} products from ${seller.fullname || seller.username} on Lookups. Trusted seller since ${new Date(seller.joinedAt).getFullYear()}.`}
                url={`/store/${username}`}
                type="website"
                structuredData={structuredData}
            />

            <div className="min-h-screen bg-off-white">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft01Icon size={20} />
                            <span className="font-medium">Back</span>
                        </button>
                    </div>
                </div>

                {/* Seller Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-start gap-6">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold flex-shrink-0">
                                {(seller.fullname || seller.username)?.[0]?.toUpperCase() || "S"}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Store01Icon size={24} className="text-blue-200" />
                                    <h1 className="text-2xl font-bold">
                                        {seller.fullname || seller.username}
                                    </h1>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                                    <div className="flex items-center gap-1">
                                        <Calendar01Icon size={16} />
                                        <span>Joined {new Date(seller.joinedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-white">{seller.productCount}</span> products
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {seller.email && (
                                        <a
                                            href={`mailto:${seller.email}`}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
                                        >
                                            <Mail01Icon size={16} />
                                            Contact
                                        </a>
                                    )}
                                    {seller.phone && (
                                        <a
                                            href={`tel:${seller.phone}`}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
                                        >
                                            <CallIcon size={16} />
                                            Call
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Products ({seller.productCount})
                    </h2>

                    {products.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">This seller has no products yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <Link
                                        key={product._id}
                                        to={`/${username}/${product.slug}`}
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
