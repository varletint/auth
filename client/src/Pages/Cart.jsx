import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import { ShoppingCart01Icon, Delete02Icon, Add01Icon, Remove01Icon } from "hugeicons-react";

export default function Cart() {
    // Mock cart data - replace with actual cart state/API
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "iPhone 15 Pro Max",
            price: 1899000,
            quantity: 1,
            image: "https://via.placeholder.com/100x100?text=iPhone",
        },
        {
            id: 2,
            name: "Samsung Galaxy S24 Ultra",
            price: 1450000,
            quantity: 2,
            image: "https://via.placeholder.com/100x100?text=Samsung",
        },
    ]);
    const [loading, setLoading] = useState(false);

    const updateQuantity = (id, delta) => {
        setCartItems((items) =>
            items.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shipping = subtotal > 100000 ? 0 : 5000;
    const total = subtotal + shipping;

    return (
        <>
            <Helmet>
                <title>Shopping Cart | Lookups</title>
                <meta name="description" content="Review and manage items in your shopping cart." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Page Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <ShoppingCart01Icon size={32} className="text-emerald-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
                            {cartItems.length} items
                        </span>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <ShoppingCart01Icon size={80} className="text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                            <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
                            <Link to="/">
                                <Button text="Continue Shopping" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-xl shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                                            <p className="text-emerald-600 font-bold text-lg">
                                                ₦{item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Delete02Icon size={20} />
                                            </button>
                                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                                                >
                                                    <Remove01Icon size={18} />
                                                </button>
                                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                                                >
                                                    <Add01Icon size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span>₦{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span>{shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`}</span>
                                        </div>
                                        <hr className="border-gray-200" />
                                        <div className="flex justify-between text-xl font-bold text-gray-900">
                                            <span>Total</span>
                                            <span className="text-emerald-600">₦{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <Link to="/checkout">
                                        <Button text="Proceed to Checkout" className="w-full py-3" />
                                    </Link>
                                    <Link
                                        to="/"
                                        className="block text-center text-gray-500 hover:text-gray-700 mt-4 text-sm"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
