import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import useAuthStore from "../store/useAuthStore";
import {
    SmartPhone01Icon,
    Dress01Icon,
    Home01Icon,
    Dumbbell01Icon,
    OrganicFoodIcon,
    Book02Icon,
    GameController01Icon,
    HeartbreakIcon,
    Car01Icon,
    MoreHorizontalIcon,
} from "hugeicons-react";

export default function Categories() {
    const { currentUser } = useAuthStore();

    // Redirect business_management users to BizDashboard
    if (currentUser && currentUser.appType === "business_management") {
        return <Navigate to="/biz-dashboard" replace />;
    }

    const categories = [
        {
            name: "Electronics",
            icon: SmartPhone01Icon,
            color: "from-blue-500 to-indigo-600",
            count: 1234,
            description: "Phones, Laptops, TVs & More",
        },
        {
            name: "Fashion",
            icon: Dress01Icon,
            color: "from-pink-500 to-rose-600",
            count: 856,
            description: "Clothing, Shoes & Accessories",
        },
        {
            name: "Home & Garden",
            icon: Home01Icon,
            color: "from-emerald-500 to-teal-600",
            count: 520,
            description: "Furniture, Decor & Outdoor",
        },
        {
            name: "Sports & Outdoors",
            icon: Dumbbell01Icon,
            color: "from-orange-500 to-amber-600",
            count: 312,
            description: "Fitness, Camping & Sports Gear",
        },
        {
            name: "Food & Beverages",
            icon: OrganicFoodIcon,
            color: "from-green-500 to-lime-600",
            count: 445,
            description: "Groceries, Snacks & Drinks",
        },
        {
            name: "Books & Media",
            icon: Book02Icon,
            color: "from-purple-500 to-violet-600",
            count: 678,
            description: "Books, Music & Movies",
        },
        {
            name: "Toys & Games",
            icon: GameController01Icon,
            color: "from-red-500 to-pink-600",
            count: 234,
            description: "Toys, Board Games & Video Games",
        },
        {
            name: "Health & Beauty",
            icon: HeartbreakIcon,
            color: "from-cyan-500 to-blue-600",
            count: 567,
            description: "Skincare, Makeup & Wellness",
        },
        {
            name: "Automotive",
            icon: Car01Icon,
            color: "from-gray-600 to-slate-800",
            count: 189,
            description: "Car Parts & Accessories",
        },
        {
            name: "Other",
            icon: MoreHorizontalIcon,
            color: "from-slate-500 to-gray-600",
            count: 345,
            description: "Everything Else",
        },
    ];

    return (
        <>
            <Helmet>
                <title>Browse Categories | Lookups</title>
                <meta name="description" content="Explore all product categories on Lookups marketplace." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h1>
                        <p className="text-gray-600 text-lg">
                            Discover products across all categories
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                to={`/search?category=${encodeURIComponent(category.name)}`}
                                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`}></div>
                                <div className="relative p-6 text-white">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <category.icon size={32} />
                                        </div>
                                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                            {category.count.toLocaleString()} items
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                                    <p className="text-white/80 text-sm">{category.description}</p>
                                    <div className="mt-4 flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                        Browse Category →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Featured Categories Banner */}
                    <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Looking for something specific?</h2>
                                <p className="text-white/80">Use our search to find exactly what you need</p>
                            </div>
                            <Link
                                to="/search"
                                className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                            >
                                Search Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
