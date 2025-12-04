import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Input from "../Components/Input";
import { Search01Icon, FilterIcon, GridViewIcon } from "hugeicons-react";
import { productApi } from "../api/productApi";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "newest",
    });

    const categories = [
        "All Categories",
        "Electronics",
        "Fashion",
        "Home & Garden",
        "Sports & Outdoors",
        "Food & Beverages",
    ];

    useEffect(() => {
        const searchProducts = async () => {
            if (!query.trim()) {
                setProducts([]);
                return;
            }

            setLoading(true);
            try {
                const params = { search: query };
                if (filters.category && filters.category !== "All Categories") {
                    params.category = filters.category;
                }
                const data = await productApi.getProducts(params);
                setProducts(data.products || []);
            } catch (error) {
                console.error("Search error:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchProducts, 300);
        return () => clearTimeout(debounceTimer);
    }, [query, filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ q: query });
    };

    return (
        <>
            <Helmet>
                <title>{query ? `Search: ${query}` : "Search Products"} | Lookups</title>
                <meta name="description" content="Search for products on Lookups marketplace." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Search Header */}
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="relative">
                            <Search01Icon
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for products, brands, categories..."
                                className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                            />
                        </div>
                    </form>

                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <p className="text-gray-600">
                            {loading
                                ? "Searching..."
                                : products.length > 0
                                    ? `${products.length} results for "${query}"`
                                    : query
                                        ? `No results for "${query}"`
                                        : "Start typing to search"}
                        </p>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <FilterIcon size={18} />
                            Filters
                        </button>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        className="w-full p-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Min Price (₦)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={filters.minPrice}
                                        OnChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Max Price (₦)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="Any"
                                        value={filters.maxPrice}
                                        OnChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                        className="w-full p-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                        <option value="popular">Most Popular</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                                    <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <Link
                                    key={product._id || product.id}
                                    to={`/product/${product._id || product.id}`}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                                >
                                    <div className="aspect-square bg-gray-100 overflow-hidden">
                                        <img
                                            src={product.images?.[0] || "https://via.placeholder.com/200"}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                                        <p className="text-emerald-600 font-bold mt-1">
                                            ₦{product.price?.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : query ? (
                        <div className="text-center py-16">
                            <Search01Icon size={80} className="text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">No products found</h2>
                            <p className="text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Search01Icon size={80} className="text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">Search Products</h2>
                            <p className="text-gray-500">Enter a search term to find products</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </>
    );
}
