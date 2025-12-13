import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { SadDizzyIcon, Home01Icon, Search01Icon } from "hugeicons-react";

export default function NotFound() {
    return (
        <>
            <Helmet>
                <title>404 - Page Not Found | Lookups</title>
                <meta name="description" content="The page you're looking for doesn't exist." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
                <div className="container mx-auto px-4 text-center">
                    {/* 404 Animation */}
                    <div className="relative inline-block mb-8">
                        <div className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600 leading-none">
                            404
                        </div>
                        <SadDizzyIcon
                            size={80}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600 animate-bounce"
                        />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Oops! Page Not Found
                    </h1>
                    <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
                        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/"
                            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            <Home01Icon size={20} />
                            Go Home
                        </Link>
                        <Link
                            to="/search"
                            className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <Search01Icon size={20} />
                            Search Products
                        </Link>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-gray-500 mb-4">Or check out these popular pages:</p>
                        <div className="flex flex-wrap gap-3 justify-center text-sm">
                            <Link to="/categories" className="text-emerald-600 hover:underline">Categories</Link>
                            <span className="text-gray-300">•</span>
                            <Link to="/about" className="text-emerald-600 hover:underline">About Us</Link>
                            <span className="text-gray-300">•</span>
                            <Link to="/contact" className="text-emerald-600 hover:underline">Contact</Link>
                            <span className="text-gray-300">•</span>
                            <Link to="/login" className="text-emerald-600 hover:underline">Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
