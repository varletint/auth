import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import { FavouriteIcon, ShoppingCart01Icon, Delete02Icon, Loading03Icon } from "hugeicons-react";
import { wishlistApi } from "../api/wishlistApi";
import { cartApi } from "../api/cartApi";

export default function Wishlist() {
    const { currentUser } = useAuthStore();
    const navigate = useNavigate();

    // Redirect business_management users to BizDashboard
    if (currentUser && currentUser.appType === "business_management") {
        return <Navigate to="/biz-dashboard" replace />;
    }

    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        // Redirect if not logged in
        if (!currentUser) {
            navigate("/login", { state: { from: "/wishlist" } });
            return;
        }

        fetchWishlist();
    }, [currentUser, navigate]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await wishlistApi.getWishlist();
            setWishlistItems(response.items || []);
        } catch (err) {
            setError(err.message || "Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (productId) => {
        try {
            setRemovingId(productId);
            await wishlistApi.removeFromWishlist(productId);
            setWishlistItems((items) => items.filter((item) => item.productId !== productId));
        } catch (err) {
            setError(err.message || "Failed to remove item");
        } finally {
            setRemovingId(null);
        }
    };

    const moveToCart = async (productId) => {
        try {
            setRemovingId(productId); // Reuse removing state for loading UI
            await cartApi.addToCart(productId, 1);
            await wishlistApi.removeFromWishlist(productId);
            setWishlistItems((items) => items.filter((item) => item.productId !== productId));
        } catch (err) {
            setError(err.message || "Failed to move item to cart");
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8 mt-10 flex items-center justify-center">
                    <Loading03Icon size={48} className="text-emerald-600 animate-spin" />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>My Wishlist | Lookups</title>
                <meta name="description" content="View and manage your saved items." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center gap-3 mb-8">
                        <FavouriteIcon size={25} className="text-red-500" />
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">My Wishlist</h1>
                        <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
                            {wishlistItems.length} items
                        </span>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                            <button
                                onClick={fetchWishlist}
                                className="ml-4 text-red-600 font-semibold hover:underline py-2"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {wishlistItems.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <FavouriteIcon size={80} className="text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-500 mb-6">Save items you love for later!</p>
                            <Link to="/">
                                <Button text="Explore Products" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistItems.map((item) => (
                                <div
                                    key={item.productId}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                                >
                                    <div className="relative aspect-square bg-gray-100">
                                        <img
                                            src={item.image || "https://via.placeholder.com/200x200?text=No+Image"}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            disabled={removingId === item.productId}
                                            className="absolute top-3 right-3 p-2 py-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            {removingId === item.productId ? (
                                                <Loading03Icon size={18} className="animate-spin" />
                                            ) : (
                                                <Delete02Icon size={18} />
                                            )}
                                        </button>
                                        {!item.inStock && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <Link to={`/product/${item.productId}`}>
                                            <h3 className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors truncate">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-emerald-600 font-bold text-lg mt-1">
                                            ₦{item.price?.toLocaleString()}
                                        </p>
                                        <button
                                            onClick={() => moveToCart(item.productId)}
                                            disabled={!item.inStock}
                                            className={`w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-colors ${item.inStock
                                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                }`}
                                        >
                                            <ShoppingCart01Icon size={18} />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
