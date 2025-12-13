import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { CreditCardIcon, DeliveryTruck01Icon, CheckmarkCircle02Icon } from "hugeicons-react";

export default function Checkout() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        paymentMethod: "card",
    });

    // Mock order total
    const orderTotal = 3349000;

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            setLoading(true);
            // Simulate order processing
            setTimeout(() => {
                setLoading(false);
                navigate("/orders");
            }, 2000);
        }
    };

    const steps = [
        { id: 1, name: "Shipping", icon: DeliveryTruck01Icon },
        { id: 2, name: "Payment", icon: CreditCardIcon },
        { id: 3, name: "Confirm", icon: CheckmarkCircle02Icon },
    ];

    return (
        <>
            <Helmet>
                <title>Checkout | Lookups</title>
                <meta name="description" content="Complete your purchase securely." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Progress Steps */}
                    <div className="flex justify-center mb-8">
                        {steps.map((s, idx) => (
                            <div key={s.id} className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= s.id
                                        ? "bg-emerald-600 text-white"
                                        : "bg-gray-200 text-gray-500"
                                        } transition-colors`}
                                >
                                    <s.icon size={20} />
                                </div>
                                <span
                                    className={`ml-2 font-semibold ${step >= s.id ? "text-emerald-600" : "text-gray-400"
                                        }`}
                                >
                                    {s.name}
                                </span>
                                {idx < steps.length - 1 && (
                                    <div
                                        className={`w-16 h-1 mx-4 rounded ${step > s.id ? "bg-emerald-600" : "bg-gray-200"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <form onSubmit={handleSubmit}>
                            {/* Step 1: Shipping */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        Shipping Information
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <Input
                                                type="text"
                                                id="fullName"
                                                placeholder="John Doe"
                                                value={formData.fullName}
                                                OnChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <Input
                                                type="email"
                                                id="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                OnChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <Input
                                            type="tel"
                                            id="phone"
                                            placeholder="+234 800 000 0000"
                                            value={formData.phone}
                                            OnChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Delivery Address
                                        </label>
                                        <Input
                                            type="text"
                                            id="address"
                                            placeholder="123 Main Street, Apartment 4B"
                                            value={formData.address}
                                            OnChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                City
                                            </label>
                                            <Input
                                                type="text"
                                                id="city"
                                                placeholder="Lagos"
                                                value={formData.city}
                                                OnChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                State
                                            </label>
                                            <Input
                                                type="text"
                                                id="state"
                                                placeholder="Lagos"
                                                value={formData.state}
                                                OnChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                ZIP Code
                                            </label>
                                            <Input
                                                type="text"
                                                id="zipCode"
                                                placeholder="100001"
                                                value={formData.zipCode}
                                                OnChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Payment */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        Payment Method
                                    </h2>
                                    <div className="space-y-4">
                                        {[
                                            { id: "card", name: "Credit/Debit Card", desc: "Visa, Mastercard, Verve" },
                                            { id: "transfer", name: "Bank Transfer", desc: "Pay directly from your bank" },
                                            { id: "cod", name: "Cash on Delivery", desc: "Pay when you receive" },
                                        ].map((method) => (
                                            <label
                                                key={method.id}
                                                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === method.id
                                                    ? "border-emerald-500 bg-emerald-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method.id}
                                                    checked={formData.paymentMethod === method.id}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            paymentMethod: e.target.value,
                                                        }))
                                                    }
                                                    className="w-5 h-5 text-emerald-600"
                                                />
                                                <div className="ml-4">
                                                    <p className="font-semibold text-gray-900">{method.name}</p>
                                                    <p className="text-sm text-gray-500">{method.desc}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Confirmation */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <CheckmarkCircle02Icon size={80} className="text-emerald-500 mx-auto mb-4" />
                                        <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping to:</span>
                                            <span className="font-semibold">{formData.address}, {formData.city}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment:</span>
                                            <span className="font-semibold capitalize">{formData.paymentMethod}</span>
                                        </div>
                                        <hr />
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total:</span>
                                            <span className="text-emerald-600">₦{orderTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className="px-6 py-2 text-gray-600 hover:text-gray-900 font-semibold"
                                    >
                                        ← Back
                                    </button>
                                ) : (
                                    <Link to="/cart" className="px-6 py-2 text-gray-600 hover:text-gray-900 font-semibold">
                                        ← Back to Cart
                                    </Link>
                                )}
                                <Button
                                    text={
                                        loading
                                            ? "Processing..."
                                            : step === 3
                                                ? "Place Order"
                                                : "Continue"
                                    }
                                    className="px-8"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
