import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { Image01Icon, Cancel01Icon, Edit02Icon } from "hugeicons-react";
import { productApi } from "../api/productApi";

const schema = yup.object({
    name: yup
        .string()
        .required("Product name is required")
        .min(3, "Name must be at least 3 characters"),
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
        .required("Brand is required"),
    stock: yup
        .number()
        .required("Stock quantity is required")
        .integer("Stock must be a whole number")
        .min(0, "Stock cannot be negative")
        .typeError("Stock must be a number"),
}).required();

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayPrice, setDisplayPrice] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
    });

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
        "Fragrance",
        "Beauty",
        "Other"
    ];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setFetchLoading(true);
                const product = await productApi.getProduct(id);

                // Populate form fields
                setValue("name", product.name);
                setValue("description", product.description);
                setValue("price", product.price);
                setValue("category", product.category);
                setValue("brand", product.brand);
                setValue("stock", product.stock);

                // Set display price with formatting
                setDisplayPrice(formatPrice(product.price.toString()));

                // Set existing images
                setExistingImages(product.images || []);
            } catch (error) {
                console.error("Error fetching product:", error);
                setError("Failed to load product");
            } finally {
                setFetchLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, setValue]);

    const formatPrice = (value) => {
        if (!value) return "";
        const numericValue = value.toString().replace(/[^0-9.]/g, "");
        const parts = numericValue.split(".");
        let integerPart = parts[0];
        const decimalPart = parts[1];
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (decimalPart !== undefined) {
            return `${integerPart}.${decimalPart.slice(0, 2)}`;
        }
        return integerPart;
    };

    const handlePriceChange = (e) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/[^0-9.]/g, "");
        const decimalCount = (numericValue.match(/\./g) || []).length;
        if (decimalCount > 1) return;
        setValue("price", numericValue, { shouldValidate: true });
        setDisplayPrice(formatPrice(numericValue));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = files.length + images.length + existingImages.length;

        if (totalImages > 5) {
            setError("You can only have up to 5 images");
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);
        const previews = newImages.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
        setError(null);
    };

    const removeNewImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        URL.revokeObjectURL(imagePreviews[index]);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        if (existingImages.length === 0 && images.length === 0) {
            setError("Please have at least one product image");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let imageUrls = [...existingImages];

            // Upload new images if any
            if (images.length > 0) {
                const { uploadMultipleImages } = await import('../utils/uploadImage');
                const newImageUrls = await uploadMultipleImages(images, 'products');
                imageUrls = [...imageUrls, ...newImageUrls];
            }

            const productData = {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                category: data.category,
                brand: data.brand,
                stock: Number(data.stock),
                images: imageUrls,
            };

            await productApi.updateProduct(id, productData);
            navigate(`/product/${id}`);
        } catch (err) {
            console.error('Error updating product:', err);
            setError(err.message || "An error occurred while updating the product");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-12 mt-10">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                            <div className="space-y-4">
                                <div className="h-12 bg-gray-200 rounded"></div>
                                <div className="h-24 bg-gray-200 rounded"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-12 bg-gray-200 rounded"></div>
                                    <div className="h-12 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12 mt-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Edit02Icon size={32} className="text-emerald-600" />
                            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                        </div>
                        <p className="text-gray-600">Update your product details</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Product Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Name *
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter product name"
                                    id="name"
                                    {...register("name")}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
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
                                    placeholder="Describe your product..."
                                    {...register("description")}
                                    className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none ${errors.description ? "border-red-500" : ""
                                        }`}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Price and Stock */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price (₦) *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                                        <Input
                                            type="text"
                                            placeholder="0.00"
                                            id="price"
                                            value={displayPrice}
                                            onChange={handlePriceChange}
                                            className={`pl-8 ${errors.price ? "border-red-500" : ""}`}
                                        />
                                    </div>
                                    {errors.price && (
                                        <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
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
                                        className={errors.stock ? "border-red-500" : ""}
                                    />
                                    {errors.stock && (
                                        <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
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
                                        className={`w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all ${errors.category ? "border-red-500" : ""
                                            }`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
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
                                        className={errors.brand ? "border-red-500" : ""}
                                    />
                                    {errors.brand && (
                                        <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Images Section */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Images
                                </label>

                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 mb-2">Current Images:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {existingImages.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={url}
                                                        alt={`Product ${index + 1}`}
                                                        className="w-24 h-24 object-cover rounded-lg border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Cancel01Icon size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Images */}
                                {imagePreviews.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 mb-2">New Images:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {imagePreviews.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={url}
                                                        alt={`New ${index + 1}`}
                                                        className="w-24 h-24 object-cover rounded-lg border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Cancel01Icon size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                {existingImages.length + images.length < 5 && (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                                        <Image01Icon size={32} className="text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click to add images</span>
                                        <span className="text-xs text-gray-400">
                                            {5 - existingImages.length - images.length} remaining
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="flex-1 py-3 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <Button
                                    text={loading ? "Updating..." : "Update Product"}
                                    className="flex-1 py-3"
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
