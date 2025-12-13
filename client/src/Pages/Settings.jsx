import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import {
    Settings02Icon,
    Notification02Icon,
    SecurityLockIcon,
    UserIcon,
    Globe02Icon,
    Moon02Icon,
} from "hugeicons-react";

export default function Settings() {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        orderUpdates: true,
        promotions: false,
        darkMode: false,
        language: "en",
        currency: "NGN",
        twoFactorAuth: false,
    });

    const handleToggle = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        console.log("Saving settings:", settings);
        // Save to backend
    };

    const SettingToggle = ({ label, description, checked, onChange }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
                <p className="font-semibold text-gray-900">{label}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
                onClick={onChange}
                className={`relative w-12 h-6 py-2 rounded-full transition-colors ${checked ? "bg-emerald-600" : "bg-gray-300"
                    }`}
            >
                <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "left-7" : "left-1"
                        }`}
                />
            </button>
        </div>
    );

    return (
        <>
            <Helmet>
                <title>Settings | Lookups</title>
                <meta name="description" content="Manage your account settings and preferences." />
            </Helmet>

            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="flex items-center gap-3 mb-8">
                        <Settings02Icon size={32} className="text-emerald-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Notification02Icon size={24} className="text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                        </div>
                        <SettingToggle
                            label="Email Notifications"
                            description="Receive updates via email"
                            checked={settings.emailNotifications}
                            onChange={() => handleToggle("emailNotifications")}
                        />
                        <SettingToggle
                            label="Push Notifications"
                            description="Receive push notifications"
                            checked={settings.pushNotifications}
                            onChange={() => handleToggle("pushNotifications")}
                        />
                        <SettingToggle
                            label="Order Updates"
                            description="Get notified about order status changes"
                            checked={settings.orderUpdates}
                            onChange={() => handleToggle("orderUpdates")}
                        />
                        <SettingToggle
                            label="Promotions & Deals"
                            description="Receive promotional offers"
                            checked={settings.promotions}
                            onChange={() => handleToggle("promotions")}
                        />
                    </div>

                    {/* Security Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <SecurityLockIcon size={24} className="text-red-600" />
                            <h2 className="text-xl font-bold text-gray-900">Security</h2>
                        </div>
                        <SettingToggle
                            label="Two-Factor Authentication"
                            description="Add an extra layer of security"
                            checked={settings.twoFactorAuth}
                            onChange={() => handleToggle("twoFactorAuth")}
                        />
                        <div className="py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">Change Password</p>
                                    <p className="text-sm text-gray-500">Update your password</p>
                                </div>
                                <button className="text-emerald-600 font-semibold hover:text-emerald-700 py-2">
                                    Change →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe02Icon size={24} className="text-purple-600" />
                            <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
                        </div>
                        <div className="py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">Language</p>
                                    <p className="text-sm text-gray-500">Select your preferred language</p>
                                </div>
                                <select
                                    value={settings.language}
                                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                    className="px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none"
                                >
                                    <option value="en">English</option>
                                    <option value="fr">French</option>
                                    <option value="es">Spanish</option>
                                </select>
                            </div>
                        </div>
                        <div className="py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">Currency</p>
                                    <p className="text-sm text-gray-500">Select your currency</p>
                                </div>
                                <select
                                    value={settings.currency}
                                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                    className="px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none"
                                >
                                    <option value="NGN">Nigerian Naira (₦)</option>
                                    <option value="USD">US Dollar ($)</option>
                                    <option value="EUR">Euro (€)</option>
                                </select>
                            </div>
                        </div>
                        <SettingToggle
                            label="Dark Mode"
                            description="Switch to dark theme"
                            checked={settings.darkMode}
                            onChange={() => handleToggle("darkMode")}
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button text="Save Changes" onClick={handleSave} className="px-8" />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
