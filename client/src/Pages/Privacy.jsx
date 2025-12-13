import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function Privacy() {
    return (
        <>
            <Helmet>
                <title>Privacy Policy | Lookups</title>
                <meta name="description" content="Read Lookups' Privacy Policy." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                        <p className="text-gray-500 mb-8">Last updated: December 2024</p>

                        <div className="prose prose-lg max-w-none text-gray-600">
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                                <p className="mb-4">We collect information you provide directly to us, including:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Name, email address, and phone number when you create an account</li>
                                    <li>Payment information when you make purchases</li>
                                    <li>Shipping addresses for delivery purposes</li>
                                    <li>Communications you send to us or other users</li>
                                    <li>Product listings if you're a seller</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                                <p className="mb-4">We use the information we collect to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Process transactions and send related information</li>
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Send promotional communications (with your consent)</li>
                                    <li>Detect, investigate, and prevent fraudulent transactions</li>
                                    <li>Personalize your experience on the platform</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                                <p className="mb-4">We may share your information with:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Sellers (for order fulfillment)</li>
                                    <li>Payment processors (to complete transactions)</li>
                                    <li>Service providers who assist our operations</li>
                                    <li>Law enforcement when required by law</li>
                                </ul>
                                <p className="mt-4">We do not sell your personal information to third parties.</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                                <p>
                                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies</h2>
                                <p>
                                    We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can manage cookie preferences through your browser settings.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                                <p className="mb-4">You have the right to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Access your personal data</li>
                                    <li>Correct inaccurate information</li>
                                    <li>Delete your account and associated data</li>
                                    <li>Opt-out of marketing communications</li>
                                    <li>Export your data in a portable format</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
                                <p>
                                    We retain your personal information for as long as your account is active or as needed to provide services. We may retain certain information for legal compliance and dispute resolution.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
                                <p>
                                    For privacy-related questions or requests, contact us at{" "}
                                    <a href="mailto:privacy@lookups.com" className="text-emerald-600 hover:underline">
                                        privacy@lookups.com
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
