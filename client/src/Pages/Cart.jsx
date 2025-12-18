import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import { ShoppingCart01Icon, Delete02Icon, Add01Icon, Remove01Icon, Loading03Icon, PackageIcon } from "hugeicons-react";
import { cartApi } from "../api/cartApi";
import { createBulkOrders } from "../api/orderApi";

export default function Cart() {
    const { currentUser } = useAuthStore();
    const navigate = useNavigate();

    // Redirect business_management users to BizDashboard
    if (currentUser && currentUser.appType === "business_management") {
        return <Navigate to="/biz-dashboard" replace />;
    }

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [removingId, setRemovingId] = useState(null);
    const [ordering, setOrdering] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    useEffect(() => {
        // Redirect if not logged in
        if (!currentUser) {
            navigate("/login", { state: { from: "/cart" } });
            return;
        }

        fetchCart();
    }, [currentUser, navigate]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await cartApi.getCart();
            setCartItems(response.items || []);
        } catch (err) {
            setError(err.message || "Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, delta) => {
        const item = cartItems.find((i) => i.productId === productId);
        if (!item) return;

        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return;

        // Prevent incrementing beyond available stock
        if (delta > 0 && item.stock && newQuantity > item.stock) {
            setError(`Only ${item.stock} items available in stock`);
            return;
        }

        try {
            setUpdatingId(productId);
            setError(null);
            await cartApi.updateQuantity(productId, newQuantity);
            setCartItems((items) =>
                items.map((i) =>
                    i.productId === productId ? { ...i, quantity: newQuantity } : i
                )
            );
        } catch (err) {
            setError(err.message || "Failed to update quantity");
        } finally {
            setUpdatingId(null);
        }
    };

    const removeItem = async (productId) => {
        try {
            setRemovingId(productId);
            await cartApi.removeFromCart(productId);
            setCartItems((items) => items.filter((item) => item.productId !== productId));
        } catch (err) {
            setError(err.message || "Failed to remove item");
        } finally {
            setRemovingId(null);
        }
    };

    // Place orders for all items in cart (bulk)
    const placeOrders = async () => {
        if (cartItems.length === 0) return;

        try {
            setOrdering(true);
            setError(null);
            setOrderSuccess(false);

            // Create bulk orders in one API call
            const items = cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            }));

            await createBulkOrders(items);

            // Clear cart after successful orders
            await cartApi.clearCart();
            setCartItems([]);
            setOrderSuccess(true);
        } catch (err) {
            setError(err.message || "Failed to place orders");
        } finally {
            setOrdering(false);
        }
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shipping = subtotal > 100000 ? 0 : 5000;
    const total = subtotal + shipping;

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                    <Loading03Icon size={48} className="text-emerald-600 animate-spin" />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Shopping Cart | Lookups</title>
                <meta name="description" content="Review and manage items in your shopping cart." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Page Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <ShoppingCart01Icon size={32} className="text-emerald-600" />
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl  font-bold text-gray-900">Shopping Cart</h1>
                        <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
                            {cartItems.length} items
                        </span>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                            <button
                                onClick={fetchCart}
                                className="ml-4 text-red-600 font-semibold hover:underline py-2"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {orderSuccess && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                            <span>🎉 Orders placed successfully! Waiting for seller approval.</span>
                            <Link
                                to="/my-orders"
                                className="text-emerald-600 font-semibold hover:underline"
                            >
                                Track Orders →
                            </Link>
                        </div>
                    )}

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
                        <div className="grid lg:grid-cols-3 gap-2.5">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="bg-white rounded-xl shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow"
                                    >
                                        <Link to={`/product/${item.productId}`}>
                                            <img
                                                src={item.image || "https://via.placeholder.com/100x100?text=No+Image"}
                                                alt={item.name}
                                                className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                                            />
                                        </Link>
                                        <div className="flex-1">
                                            <Link to={`/product/${item.productId}`}>
                                                <h3 className="font-semibold text-gray-900 mb-1 hover:text-emerald-600 transition-colors">{item.name}</h3>
                                            </Link>
                                            <p className="text-emerald-600 font-bold text-lg">
                                                ₦{item.price?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                disabled={removingId === item.productId}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {removingId === item.productId ? (
                                                    <Loading03Icon size={20} className="animate-spin" />
                                                ) : (
                                                    <Delete02Icon size={20} />
                                                )}
                                            </button>
                                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, -1)}
                                                    disabled={updatingId === item.productId || item.quantity <= 1}
                                                    className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                                                >
                                                    <Remove01Icon size={18} />
                                                </button>
                                                <span className="w-8 text-center font-semibold">
                                                    {updatingId === item.productId ? (
                                                        <Loading03Icon size={16} className="animate-spin mx-auto" />
                                                    ) : (
                                                        item.quantity
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, 1)}
                                                    disabled={updatingId === item.productId}
                                                    className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
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
                                    {/*  */}
                                    <button
                                        onClick={placeOrders}
                                        disabled={ordering || cartItems.length === 0}
                                        className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {ordering ? (
                                            <>
                                                <Loading03Icon size={20} className="animate-spin" />
                                                Placing Orders...
                                            </>
                                        ) : (
                                            <>
                                                <PackageIcon size={20} />
                                                Place Order
                                            </>
                                        )}
                                    </button>
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
