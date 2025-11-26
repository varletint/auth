import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { Image01Icon, Cancel01Icon } from "hugeicons-react";

const schema = yup.object({
    title: yup
        .string()
        .required("Product title is required")
        .min(3, "Title must be at least 3 characters"),
    description: yup
        .string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
    price: yup
        .number()
        .required("Price is required")
        .positive("Price must be positive")
        .typeError("Price must be a number"),
    category: yup
        .string()
        .required("Category is required"),
    brand: yup
        .string()
        .required("Brand is required or Product name is required"),
    stock: yup
        .number()
        .required("Stock quantity is required")
        .integer("Stock must be a whole number")
        .min(0, "Stock cannot be negative")
        .typeError("Stock must be a number"),
}).required();

export default function AddProduct() {
    document.title = "Add Product | Create New Listing";
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + images.length > 5) {
            setError("You can only upload up to 5 images");
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        // Create preview URLs
        const previews = newImages.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
        setError(null);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        // Revoke the URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index]);

        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const onSubmit = async (data) => {
        if (images.length === 0) {
            setError("Please upload at least one product image");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Append all form fields
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });

            // Append images
            images.forEach((image, index) => {
                formData.append('images', image);
            });

            const res = await fetch("/api/products", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Failed to create product");
                setLoading(false);
                return;
            }

            console.log("Product created successfully:", result);

            // Reset form and images
            reset();
            setImages([]);
            setImagePreviews([]);

            // Navigate to the product page or home
            navigate(`/product/${result.id || result._id}`);
        } catch (err) {
            setError(err.message || "An error occurred while creating the product");
            setLoading(false);
        }
    };

    const categories = [
        "Electronics",
        "Fashion",
        "Home & Garden",
        "Sports & Outdoors",
        "Food & Beverages",
        "Books & Media",
        "Toys & Games",
        "Health & Beauty",
        "Automotive",
        "Frangrance",
        "Beauty",
        "Other"
    ];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-off-white py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-deep-black mb-2">
                            Add New Product
                        </h1>
                        <p className="text-gray-600">
                            List your product and reach thousands of potential buyers
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Product Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Title *
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter product title"
                                    id="title"
                                    {...register("title")}
                                    className={errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    placeholder="Describe your product in detail..."
                                    {...register("description")}
                                    className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-off-white text-gray-800 placeholder-gray-400 resize-none ${errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
                                        }`}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Price and Stock */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price (₦) *
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        id="price"
                                        step="0.01"
                                        {...register("price")}
                                        className={errors.price ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.price.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Stock Quantity *
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        id="stock"
                                        {...register("stock")}
                                        className={errors.stock ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}
                                    />
                                    {errors.stock && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.stock.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Category and Brand */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        id="category"
                                        {...register("category")}
                                        className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-off-white text-gray-800 ${errors.category ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
                                            }`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.category.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Brand *
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Enter brand name"
                                        id="brand"
                                        {...register("brand")}
                                        className={errors.brand ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}
                                    />
                                    {errors.brand && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.brand.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Images * (Max 5)
                                </label>

                                {/* Upload Button */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="images"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary/5 hover:bg-primary/10 text-cyan-dark font-semibold rounded-lg cursor-pointer transition-all duration-200 border-2 border-primary/20 hover:border-emerald-300"
                                    >
                                        <Image01Icon size={20} />
                                        <span>Choose Images</span>
                                    </label>
                                    <input
                                        id="images"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={images.length >= 5}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        {images.length}/5 images uploaded
                                    </p>
                                </div>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-emerald-400 transition-all duration-200"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    aria-label="Remove image"
                                                >
                                                    <Cancel01Icon size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    text={loading ? "Creating Product..." : "Create Product"}
                                    className={`bg-gradient-to-r from-primary to-yellow-accent hover:from-primary-dark hover:to-cyan-dark w-full ${loading ? "opacity-70 cursor-not-allowed" : ""
                                        }`}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Info Card */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Tips for a Great Listing
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1 ml-7">
                            <li>• Use high-quality images that showcase your product</li>
                            <li>• Write a detailed, honest description</li>
                            <li>• Set a competitive price based on market research</li>
                            <li>• Choose the most appropriate category for better visibility</li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}


