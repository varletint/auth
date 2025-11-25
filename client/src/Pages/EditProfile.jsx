import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import Input from "../Components/Input";
import Button from "../Components/Button";
import {
    ArrowLeft01Icon,
    Camera01Icon,
    UserIcon,
    Mail01Icon,
    SmartPhone01Icon,
    Location01Icon,
} from "hugeicons-react";

export default function EditProfile() {
    const { currentUser } = useAuthStore();
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        firstName: "",
        lastName: "",
        phone: "",
        bio: "",
        location: "",
        website: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            // TODO: Replace with actual API endpoint
            const response = await fetch("/api/user/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const data = await response.json();
            setSuccess("Profile updated successfully!");

            // Navigate back to profile after a short delay
            setTimeout(() => {
                navigate("/profile");
            }, 1500);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <div className='bg-white border-b border-gray-200 sticky top-0 z-10'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 py-4'>
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => navigate("/profile")}
                            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                        >
                            <ArrowLeft01Icon size={20} className='text-gray-700' />
                        </button>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900'>Edit Profile</h1>
                            <p className='text-sm text-gray-500'>Update your personal information</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-4xl mx-auto px-4 sm:px-6 py-8'>
                {/* Profile Picture Section */}
                <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6'>
                    <h2 className='text-lg font-semibold text-gray-900 mb-4'>Profile Picture</h2>
                    <div className='flex items-center gap-6'>
                        <div className='relative'>
                            <div className='w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 uppercase overflow-hidden'>
                                {currentUser?.username?.[0] || "U"}
                            </div>
                            <button className='absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md border-2 border-white transition-colors'>
                                <Camera01Icon size={16} />
                            </button>
                        </div>
                        <div className='flex-1'>
                            <p className='text-sm text-gray-600 mb-2'>
                                Upload a new profile picture. JPG, PNG or GIF. Max size 2MB.
                            </p>
                            <div className='flex gap-3'>
                                <Button
                                    text='Upload Photo'
                                    className='!py-2 !px-4 !text-sm bg-indigo-600 hover:bg-indigo-700'
                                />
                                <button className='py-2 px-4 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-6'>Personal Information</h2>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm'>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm'>
                                {success}
                            </div>
                        )}

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Username */}
                            <div className='space-y-2'>
                                <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                                    <UserIcon size={16} className='text-gray-500' />
                                    Username
                                </label>
                                <Input
                                    type='text'
                                    name='username'
                                    placeholder='Enter username'
                                    value={formData.username}
                                    OnChange={handleChange}
                                />
                            </div>

                            {/* Email */}
                            <div className='space-y-2'>
                                <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                                    <Mail01Icon size={16} className='text-gray-500' />
                                    Email Address
                                </label>
                                <Input
                                    type='email'
                                    name='email'
                                    placeholder='Enter email'
                                    value={formData.email}
                                    OnChange={handleChange}
                                />
                            </div>

                            {/* First Name */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700'>
                                    First Name
                                </label>
                                <Input
                                    type='text'
                                    name='firstName'
                                    placeholder='Enter first name'
                                    value={formData.firstName}
                                    OnChange={handleChange}
                                />
                            </div>

                            {/* Last Name */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700'>
                                    Last Name
                                </label>
                                <Input
                                    type='text'
                                    name='lastName'
                                    placeholder='Enter last name'
                                    value={formData.lastName}
                                    OnChange={handleChange}
                                />
                            </div>

                            {/* Phone */}
                            <div className='space-y-2'>
                                <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                                    <SmartPhone01Icon size={16} className='text-gray-500' />
                                    Phone Number
                                </label>
                                <Input
                                    type='tel'
                                    name='phone'
                                    placeholder='+1 (555) 000-0000'
                                    value={formData.phone}
                                    OnChange={handleChange}
                                />
                            </div>

                            {/* Location */}
                            <div className='space-y-2'>
                                <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                                    <Location01Icon size={16} className='text-gray-500' />
                                    Location
                                </label>
                                <Input
                                    type='text'
                                    name='location'
                                    placeholder='City, Country'
                                    value={formData.location}
                                    OnChange={handleChange}
                                />
                            </div>

                            {/* Website */}
                            <div className='space-y-2 md:col-span-2'>
                                <label className='text-sm font-medium text-gray-700'>
                                    Website
                                </label>
                                <Input
                                    type='url'
                                    name='website'
                                    placeholder='https://example.com'
                                    value={formData.website}
                                    OnChange={handleChange}
                                />
                            </div>

                            {/* Bio */}
                            <div className='space-y-2 md:col-span-2'>
                                <label className='text-sm font-medium text-gray-700'>
                                    Bio
                                </label>
                                <textarea
                                    name='bio'
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 min-h-[120px] resize-none'
                                    placeholder='Tell us about yourself...'
                                />
                                <p className='text-xs text-gray-500'>
                                    Brief description for your profile. Max 200 characters.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-4 justify-end'>
                        <button
                            type='button'
                            onClick={() => navigate("/profile")}
                            className='px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors'
                        >
                            Cancel
                        </button>
                        <Button
                            text={isLoading ? "Saving..." : "Save Changes"}
                            className='bg-indigo-600 hover:bg-indigo-700'
                            onClick={handleSubmit}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
