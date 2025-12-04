import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { CustomerService01Icon, Mail01Icon, Location01Icon, Call02Icon } from "hugeicons-react";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    const contactInfo = [
        {
            icon: Mail01Icon,
            title: "Email",
            value: "support@lookups.com",
            color: "text-blue-600 bg-blue-100",
        },
        {
            icon: Call02Icon,
            title: "Phone",
            value: "+234 800 123 4567",
            color: "text-emerald-600 bg-emerald-100",
        },
        {
            icon: Location01Icon,
            title: "Address",
            value: "Lagos, Nigeria",
            color: "text-purple-600 bg-purple-100",
        },
    ];

    return (
        <>
            <Helmet>
                <title>Contact Us | Lookups</title>
                <meta name="description" content="Get in touch with Lookups support team." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8 mt-10">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <CustomerService01Icon size={48} className="text-emerald-600 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Have a question or need help? We're here for you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            {contactInfo.map((info) => (
                                <div
                                    key={info.title}
                                    className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4"
                                >
                                    <div className={`p-3 rounded-lg ${info.color}`}>
                                        <info.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{info.title}</p>
                                        <p className="font-semibold text-gray-900">{info.value}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Support Hours */}
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                                <h3 className="font-bold text-lg mb-2">Support Hours</h3>
                                <p className="text-white/80 text-sm mb-4">
                                    Our team is available to help you during these hours:
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span className="font-semibold">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span className="font-semibold">10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="font-semibold">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm p-8">
                                {submitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                                        <p className="text-gray-500 mb-6">
                                            Thank you for reaching out. We'll get back to you within 24 hours.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSubmitted(false);
                                                setFormData({ name: "", email: "", subject: "", message: "" });
                                            }}
                                            className="text-emerald-600 font-semibold hover:underline"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Your Name
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    OnChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <Input
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={formData.email}
                                                    OnChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Subject
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="How can we help?"
                                                value={formData.subject}
                                                OnChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                rows={5}
                                                placeholder="Tell us more about your inquiry..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                                            />
                                        </div>
                                        <Button
                                            text={loading ? "Sending..." : "Send Message"}
                                            className="w-full py-3"
                                        />
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
