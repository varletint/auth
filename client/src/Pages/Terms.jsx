import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function Terms() {
    return (
        <>
            <Helmet>
                <title>Terms of Service | Lookups</title>
                <meta name="description" content="Read Lookups' Terms of Service." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
                        <p className="text-gray-500 mb-8">Last updated: December 2024</p>

                        <div className="prose prose-lg max-w-none text-gray-600">
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                                <p>
                                    By accessing and using Lookups (the "Platform"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of the Platform</h2>
                                <p className="mb-4">You agree to use our Platform only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the Platform.</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>You must be at least 18 years old to use our services</li>
                                    <li>You are responsible for maintaining the confidentiality of your account</li>
                                    <li>You agree to provide accurate and complete information</li>
                                    <li>You must not use the platform for fraudulent activities</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Seller Terms</h2>
                                <p className="mb-4">If you sell products on Lookups:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>You must ensure all product listings are accurate and not misleading</li>
                                    <li>You are responsible for fulfilling orders in a timely manner</li>
                                    <li>You must comply with all applicable laws and regulations</li>
                                    <li>You grant Lookups permission to display your products on the platform</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Buyer Terms</h2>
                                <p className="mb-4">As a buyer on Lookups:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>You agree to pay for items you purchase</li>
                                    <li>You will not engage in fraudulent transactions</li>
                                    <li>You will communicate respectfully with sellers</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
                                <p>
                                    All content on this Platform, including text, graphics, logos, and software, is the property of Lookups or its content suppliers and is protected by copyright laws.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
                                <p>
                                    Lookups shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Platform.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Changes to Terms</h2>
                                <p>
                                    We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new terms on this page with an updated revision date.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
                                <p>
                                    If you have any questions about these Terms, please contact us at{" "}
                                    <a href="mailto:legal@lookups.com" className="text-emerald-600 hover:underline">
                                        legal@lookups.com
                                    </a>
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
