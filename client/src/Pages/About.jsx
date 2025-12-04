import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { InformationCircleIcon, Target01Icon, UserMultiple02Icon, SecurityCheckIcon } from "hugeicons-react";

export default function About() {
    const stats = [
        { label: "Products Listed", value: "10,000+" },
        { label: "Happy Customers", value: "50,000+" },
        { label: "Verified Sellers", value: "500+" },
        { label: "Orders Completed", value: "100,000+" },
    ];

    const values = [
        {
            icon: Target01Icon,
            title: "Our Mission",
            description: "To make buying and selling accessible to everyone by creating a trusted marketplace that connects sellers with buyers across Nigeria.",
        },
        {
            icon: UserMultiple02Icon,
            title: "Community First",
            description: "We believe in building a community where both buyers and sellers can thrive together through fair practices and transparent transactions.",
        },
        {
            icon: SecurityCheckIcon,
            title: "Trust & Safety",
            description: "Your security is our priority. We implement robust verification systems and buyer protection policies to ensure safe transactions.",
        },
    ];

    return (
        <>
            <Helmet>
                <title>About Us | Lookups</title>
                <meta name="description" content="Learn about Lookups - Nigeria's trusted online marketplace." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 mt-10">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Lookups</h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Nigeria's fastest-growing marketplace connecting buyers and sellers with amazing products.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-3xl md:text-4xl font-bold text-emerald-600">{stat.value}</p>
                                    <p className="text-gray-600 mt-2">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Story Section */}
                <div className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-12">
                            <InformationCircleIcon size={48} className="text-emerald-600 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                        </div>
                        <div className="prose prose-lg mx-auto text-gray-600">
                            <p className="mb-4">
                                Lookups was founded with a simple vision: to create a marketplace where anyone can buy or sell products with confidence. We started in 2024 with a small team passionate about e-commerce and technology.
                            </p>
                            <p className="mb-4">
                                Today, we've grown to become one of Nigeria's most trusted online marketplaces, hosting thousands of verified sellers and millions of products across all categories.
                            </p>
                            <p>
                                Our platform is built on the principles of trust, transparency, and community. We're committed to providing the best experience for both buyers and sellers, with features like secure payments, buyer protection, and 24/7 customer support.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="py-16 bg-white">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Stand For</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {values.map((value) => (
                                <div key={value.title} className="text-center p-6">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <value.icon size={32} className="text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-16 bg-gray-900 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Join thousands of sellers and millions of buyers on Lookups today.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                            >
                                Create Account
                            </Link>
                            <Link
                                to="/"
                                className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
