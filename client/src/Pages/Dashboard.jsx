import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import useAuthStore from "../store/useAuthStore";
import {
    DashboardSquare01Icon,
    ShoppingBag01Icon,
    MoneyReceiveSquareIcon,
    ArrowUp01Icon,
    ArrowDown01Icon,
    Add01Icon,
    Store04Icon,
    FavouriteIcon,
    Settings02Icon,
    UserIcon,
    ShoppingCart01Icon,
    Search01Icon,
} from "hugeicons-react";
import { productApi } from "../api/productApi";
import { wishlistApi } from "../api/wishlistApi";

export default function Dashboard() {
    const { currentUser } = useAuthStore();

    // Redirect business_management users to BizDashboard
    if (currentUser && currentUser.appType === "business_management") {
        return <Navigate to="/biz-dashboard" replace />;
    }

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productCount, setProductCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    // Check if user is a seller
    const isSeller = currentUser?.role?.includes("seller");

    // Quick links for easy navigation
    const quickLinks = [
        { title: "My Wishlist", icon: FavouriteIcon, path: "/wishlist", color: "bg-pink-500", count: wishlistCount },
        { title: "My Cart", icon: ShoppingCart01Icon, path: "/cart", color: "bg-blue-500" },
        { title: "My Orders", icon: ShoppingBag01Icon, path: "/orders", color: "bg-purple-500" },
        { title: "Search", icon: Search01Icon, path: "/search", color: "bg-amber-500" },
        { title: "Settings", icon: Settings02Icon, path: "/settings", color: "bg-gray-500" },
        { title: "Profile", icon: UserIcon, path: "/profile", color: "bg-teal-500" },
    ];

    // Stats data with real counts
    const stats = [
        {
            title: "Total Sales",
            value: "₦0",
            change: "Coming soon",
            isPositive: true,
            icon: MoneyReceiveSquareIcon,
            color: "bg-emerald-500",
        },
        {
            title: "My Products",
            value: productCount.toString(),
            change: isSeller ? "Active" : "N/A",
            isPositive: true,
            icon: ShoppingBag01Icon,
            color: "bg-blue-500",
            link: "/my-products",
        },
        {
            title: "Wishlist",
            value: wishlistCount.toString(),
            change: "Items saved",
            isPositive: true,
            icon: FavouriteIcon,
            color: "bg-pink-500",
            link: "/wishlist",
        },
        {
            title: "Orders",
            value: "0",
            change: "Coming soon",
            isPositive: true,
            icon: DashboardSquare01Icon,
            color: "bg-orange-500",
            link: "/orders",
        },
    ];

    // Mock recent orders
    const recentOrders = [
        { id: "ORD-001", customer: "John Doe", product: "iPhone 15 Pro", amount: 1899000, status: "completed" },
        { id: "ORD-002", customer: "Jane Smith", product: "Samsung S24", amount: 1450000, status: "pending" },
        { id: "ORD-003", customer: "Mike Brown", product: "AirPods Pro", amount: 450000, status: "shipping" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                // Fetch wishlist count for all users
                const wishlistData = await wishlistApi.getWishlist();
                setWishlistCount(wishlistData.wishlist?.products?.length || wishlistData.products?.length || 0);

                // Fetch products only for sellers
                if (isSeller) {
                    const productsData = await productApi.getProducts({
                        userId: currentUser._id || currentUser.id,
                        limit: 5
                    });
                    setProducts(productsData.products || []);
                    setProductCount(productsData.totalProducts || productsData.products?.length || 0);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser, isSeller]);

    return (
        <>
            <Helmet>
                <title>Seller Dashboard | Lookups</title>
                <meta name="description" content="Manage your store, track sales, and view analytics." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <DashboardSquare01Icon size={32} className="text-emerald-600" />
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        </div>
                        {isSeller && (
                            <Link to="/add-product">
                                <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                                    <Add01Icon size={20} />
                                    Add Product
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Become a Seller Banner - Show only for non-sellers */}
                    {!isSeller && (
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 mb-8 text-white shadow-lg shadow-emerald-200">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <Store04Icon size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold mb-1">Start Selling Today!</h2>
                                        <p className="text-emerald-100">
                                            Apply to become a seller and list your products on Lookups
                                        </p>
                                    </div>
                                </div>
                                <Link to="/become-seller">
                                    <button className="bg-white text-emerald-600 px-6 py-2 rounded-xl font-semibold hover:bg-emerald-50 transition-colors whitespace-nowrap">
                                        Become a Seller →
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat) => {
                            const StatCard = (
                                <div
                                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`${stat.color} p-3 rounded-lg`}>
                                            <stat.icon size={24} className="text-white" />
                                        </div>
                                        <div
                                            className={`flex items-center text-sm font-semibold ${stat.isPositive ? "text-emerald-600" : "text-red-500"
                                                }`}
                                        >
                                            {stat.isPositive ? <ArrowUp01Icon size={16} /> : <ArrowDown01Icon size={16} />}
                                            {stat.change}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                    <p className="text-sm text-gray-500">{stat.title}</p>
                                </div>
                            );

                            return stat.link ? (
                                <Link key={stat.title} to={stat.link}>
                                    {StatCard}
                                </Link>
                            ) : (
                                <div key={stat.title}>{StatCard}</div>
                            );
                        })}
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.title}
                                    to={link.path}
                                    className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                                >
                                    <div className={`${link.color} p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                                        <link.icon size={24} className="text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{link.title}</span>
                                    {link.count !== undefined && link.count > 0 && (
                                        <span className="text-xs text-gray-500 mt-1">{link.count} items</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                                <Link to="/orders" className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold">
                                    View All →
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900">{order.customer}</p>
                                            <p className="text-sm text-gray-500">{order.product}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-emerald-600">₦{order.amount.toLocaleString()}</p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${order.status === "completed"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : order.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">My Products</h2>
                                <Link to="/my-products" className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold">
                                    Manage →
                                </Link>
                            </div>
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="animate-pulse flex gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : products.length > 0 ? (
                                <div className="space-y-4">
                                    {products.slice(0, 5).map((product) => (
                                        <Link
                                            key={product._id || product.id}
                                            to={`/product/${product._id || product.id}`}
                                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <img
                                                src={product.images?.[0] || "https://via.placeholder.com/48"}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{product.name}</p>
                                                <p className="text-sm text-emerald-600">₦{product.price?.toLocaleString()}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">Stock: {product.stock || 0}</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">No products yet. Add your first product!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
