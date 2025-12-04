import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import { FavouriteIcon, ShoppingCart01Icon, Delete02Icon } from "hugeicons-react";

export default function Wishlist() {
    // Mock wishlist data
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 1,
            name: "iPhone 15 Pro Max",
            price: 1899000,
            image: "https://via.placeholder.com/200x200?text=iPhone",
            inStock: true,
        },
        {
            id: 2,
            name: "Samsung Galaxy S24 Ultra",
            price: 1450000,
            image: "https://via.placeholder.com/200x200?text=Samsung",
            inStock: true,
        },
        {
            id: 3,
            name: "Sony WH-1000XM5",
            price: 450000,
            image: "https://via.placeholder.com/200x200?text=Sony",
            inStock: false,
        },
    ]);

    const removeItem = (id) => {
        setWishlistItems((items) => items.filter((item) => item.id !== id));
    };

    const moveToCart = (id) => {
        // In real app, add to cart and remove from wishlist
        console.log("Moving to cart:", id);
        removeItem(id);
    };

    return (
        <>
            <Helmet>
                <title>My Wishlist | Lookups</title>
                <meta name="description" content="View and manage your saved items." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center gap-3 mb-8">
                        <FavouriteIcon size={32} className="text-red-500" />
                        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                        <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
                            {wishlistItems.length} items
                        </span>
                    </div>

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
                                    key={item.id}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                                >
                                    <div className="relative aspect-square bg-gray-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Delete02Icon size={18} />
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
                                        <Link to={`/product/${item.id}`}>
                                            <h3 className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors truncate">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-emerald-600 font-bold text-lg mt-1">
                                            ₦{item.price.toLocaleString()}
                                        </p>
                                        <button
                                            onClick={() => moveToCart(item.id)}
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
