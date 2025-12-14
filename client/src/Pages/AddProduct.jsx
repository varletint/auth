import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { Image01Icon, Cancel01Icon } from "hugeicons-react";
import { productApi } from "../api/productApi";

const popularProducts = [
    // iPhones
    { id: 'iph-16pm', name: 'iPhone 16 Pro Max', category: 'Electronics', subcategory: 'phone', brand: 'Apple', model: '16 Pro Max' },
    { id: 'iph-16p', name: 'iPhone 16 Pro', category: 'Electronics', subcategory: 'phone', brand: 'Apple', model: '16 Pro' },
    { id: 'iph-16', name: 'iPhone 16', category: 'Electronics', subcategory: 'phone', brand: 'Apple', model: '16' },
    { id: 'iph-15pm', name: 'iPhone 15 Pro Max', category: 'Electronics', subcategory: 'phone', brand: 'Apple', model: '15 Pro Max' },
    { id: 'iph-15p', name: 'iPhone 15 Pro', category: 'Electronics', subcategory: 'phone', brand: 'Apple', model: '15 Pro' },
    { id: 'iph-15', name: 'iPhone 15', category: 'Electronics', subcategory: 'phone', brand: 'Apple', model: '15' },
    { id: 'iph-14pm', name: 'iPhone 14 Pro Max', category: 'Electronics', subcategory: 'phone', brand: 'Apple', model: '14 Pro Max' },
    { id: 'iph-14p', name: 'iPhone 14 Pro', category: 'Electronics', subcategory: 'phone', brand: 'Apple', model: '14 Pro' },
    { id: 'iph-13pm', name: 'iPhone 13 Pro Max', category: 'Electronics', subcategory: 'phone', brand: 'Apple', model: '13 Pro Max' },
    { id: 'iph-13p', name: 'iPhone 13 Pro', category: 'Electronics', subcategory: 'phone', brand: 'Apple', model: '13 Pro' },
    { id: 'iph-13', name: 'iPhone 13', category: 'Electronics', subcategory: 'phone', brand: 'Apple', model: '13' },

    // Samsung
    { id: 'sam-s24u', name: 'Samsung Galaxy S24 Ultra', category: 'Electronics', subcategory: 'phone', brand: 'Samsung', model: 'S24 Ultra' },
    { id: 'sam-s24p', name: 'Samsung Galaxy S24 Plus', category: 'Electronics', subcategory: 'phone', brand: 'Samsung', model: 'S24 Plus' },
    { id: 'sam-s24', name: 'Samsung Galaxy S24', category: 'Electronics', subcategory: 'phone', brand: 'Samsung', model: 'S24' },
    { id: 'sam-s23u', name: 'Samsung Galaxy S23 Ultra', category: 'Electronics', subcategory: 'phone', brand: 'Samsung', model: 'S23 Ultra' },

    // Google
    { id: 'goo-p8p', name: 'Google Pixel 8 Pro', category: 'Electronics', subcategory: 'phone', brand: 'Google', model: 'Pixel 8 Pro' },
    { id: 'goo-p8', name: 'Google Pixel 8', category: 'Electronics', subcategory: 'phone', brand: 'Google', model: 'Pixel 8' },
];

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
    subcategory: yup
        .string()
        .when("category", {
            is: "Electronics",
            then: (schema) => schema.required("Subcategory is required for Electronics"),
            otherwise: (schema) => schema.notRequired(),
        }),
    brand: yup
        .string()
        .required("Brand is required or Product name is required"),
    model: yup.string().notRequired(),
    color: yup.string().notRequired(),
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
    const [sku, setSku] = useState("");
    const [skuCounter, setSkuCounter] = useState(1);

    // State for dynamic form fields
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    // Quick Add State
    const [addMode, setAddMode] = useState('quick'); // 'quick' or 'manual'
    const [quickSearchTerm, setQuickSearchTerm] = useState("");
    const [selectedQuickProduct, setSelectedQuickProduct] = useState(null);

    // Price formatting state
    const [displayPrice, setDisplayPrice] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });

    // Watch fields for SKU generation and dynamic rendering
    const category = watch("category");
    const productName = watch("name");
    const subcategory = watch("subcategory");
    const brand = watch("brand");
    const model = watch("model");
    const color = watch("color");

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

    // Format price for display
    const formatPrice = (value) => {
        if (!value) return "";
        // Remove all non-digit and non-decimal characters
        const numericValue = value.toString().replace(/[^0-9.]/g, "");

        // Split into integer and decimal parts
        const parts = numericValue.split(".");
        let integerPart = parts[0];
        const decimalPart = parts[1];

        // Add commas to integer part
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Combine with decimal part (limit to 2 decimal places)
        if (decimalPart !== undefined) {
            return `${integerPart}.${decimalPart.slice(0, 2)}`;
        }
        return integerPart;
    };

    // Handle price input change
    const handlePriceChange = (e) => {
        const inputValue = e.target.value;

        // Remove all non-digit and non-decimal characters for the actual value
        const numericValue = inputValue.replace(/[^0-9.]/g, "");

        // Prevent multiple decimal points
        const decimalCount = (numericValue.match(/\./g) || []).length;
        if (decimalCount > 1) return;

        // Update the form value with numeric string
        setValue("price", numericValue, { shouldValidate: true });

        // Update display value with formatting
        setDisplayPrice(formatPrice(numericValue));
    };

    const handleQuickProductSelect = (product) => {
        // Auto-fill form fields
        setValue('category', product.category);
        setValue('subcategory', product.subcategory, { shouldValidate: true });
        setValue('brand', product.brand, { shouldValidate: true });
        setValue('model', product.model, { shouldValidate: true });
        setValue('name', product.name, { shouldValidate: true });

        // Update local state for dynamic fields
        setSelectedSubcategory(product.subcategory);
        setSelectedBrand(product.brand);
        setSelectedModel(product.model);

        // Set selected product for UI feedback
        setSelectedQuickProduct(product);

        // Optional: Switch to manual mode to let user finish details
        // setAddMode('manual'); 
    };

    // Function to generate smart model abbreviation
    const getModelAbbreviation = (modelStr) => {
        if (!modelStr) return "";
        const lower = modelStr.toLowerCase();
        let prefix = "";

        // Determine prefix based on model family
        if (lower.includes("iphone") || /^\d/.test(modelStr)) {
            if (lower.match(/^\d/)) prefix = "iph-";
        } else if (lower.includes("pixel")) {
            prefix = "pix-";
        } else if (lower.includes("galaxy") || lower.startsWith("s")) {
            prefix = "gal-";
        }

        // Handle variants
        let suffix = "";
        if (lower.includes("pro max")) {
            const number = modelStr.match(/\d+/);
            suffix = number ? `${number[0]}pm` : "pm";
        } else if (lower.includes("pro")) {
            const number = modelStr.match(/\d+/);
            suffix = number ? `${number[0]}pro` : "pro";
        } else if (lower.includes("plus")) {
            const number = modelStr.match(/\d+/);
            suffix = number ? `${number[0]}pls` : "pls";
        } else if (lower.includes("ultra")) {
            const number = modelStr.match(/\d+/);
            suffix = number ? `${number[0]}ult` : "ult";
        } else {
            // Regular model
            const number = modelStr.match(/\d+/);
            if (number) suffix = number[0];
            else suffix = modelStr.substring(0, 3).toLowerCase();
        }

        return prefix + suffix;
    };

    // Function to get brand code
    const getBrandCode = (brandStr, subcat) => {
        if (!brandStr) return "";
        const lower = brandStr.toLowerCase();

        if (subcat === "phone") {
            if (lower.includes("apple")) return "app";
            if (lower.includes("samsung")) return "sam";
            if (lower.includes("google")) return "goo";
        }

        if (subcat === "tv") {
            if (lower.includes("sony")) return "son";
            if (lower.includes("lg")) return "lg";
            if (lower.includes("philips")) return "phi";
        }

        if (subcat === "laptop") {
            if (lower.includes("dell")) return "del";
            if (lower.includes("hp")) return "hp";
            if (lower.includes("lenovo")) return "len";
        }

        return brandStr.substring(0, 3).toLowerCase();
    };

    // Function to generate SKU with smart abbreviations
    const generateSKU = (category, subcategory, brand, model, color, name, counter) => {
        const parts = [];

        // Category code (3 chars)
        if (category) {
            parts.push(category.substring(0, 3).toLowerCase());
        }

        // Subcategory code (2 chars)
        if (subcategory) {
            parts.push(subcategory.substring(0, 2).toLowerCase());
        }

        // Brand code
        if (brand) {
            parts.push(getBrandCode(brand, subcategory));
        }

        // Model code
        if (model) {
            parts.push(getModelAbbreviation(model));
        } else if (name && subcategory !== "phone") {
            parts.push(name.substring(0, 3).toLowerCase());
        }

        // Color code (3 chars)
        if (color) {
            parts.push(color.substring(0, 3).toLowerCase());
        }

        // Counter (3 digits)
        const counterStr = counter.toString().padStart(4, "0");
        parts.push(counterStr);

        return parts.join("-");
    };

    // Update SKU whenever relevant fields change
    useEffect(() => {
        const newSku = generateSKU(category, subcategory, brand, model, color, productName, skuCounter);
        setSku(newSku);
    }, [category, subcategory, brand, model, color, productName, skuCounter]);

    // Reset subcategory when category changes
    useEffect(() => {
        if (category !== "Electronics") {
            setSelectedSubcategory("");
            setValue("subcategory", "");
        }
    }, [category, setValue]);

    // Reset brand when subcategory changes
    useEffect(() => {
        setSelectedBrand("");
        setValue("brand", "");
        setSelectedModel("");
        setValue("model", "");
    }, [selectedSubcategory, setValue]);

    // Reset model when brand changes
    useEffect(() => {
        setSelectedModel("");
        setValue("model", "");
    }, [selectedBrand, setValue]);

    const onSubmit = async (data) => {
        if (images.length === 0) {
            setError("Please upload at least one product image");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Step 1: Upload images to Firebase
            const { uploadMultipleImages } = await import('../utils/uploadImage');

            // Upload with progress tracking
            let uploadProgress = 0;
            const imageUrls = await uploadMultipleImages(
                images,
                'products',
                (progress) => {
                    uploadProgress = progress;
                    console.log(`Upload progress: ${progress.toFixed(0)}% `);
                }
            );

            console.log('Images uploaded successfully:', imageUrls);

            // Step 2: Send product data with image URLs to backend
            const productData = {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                category: data.category,
                brand: data.brand,
                stock: Number(data.stock),
                images: imageUrls,
                sku: sku, // Add generated SKU to product data
                subcategory: data.subcategory || undefined,
                model: data.model || undefined,
                color: data.color || undefined,
            };

            const result = await productApi.createProduct(productData);

            // console.log("Product created successfully:", result);

            // Reset form and images
            reset();
            setImages([]);
            setImagePreviews([]);
            setSku("");
            setSkuCounter(1);
            setSelectedSubcategory("");
            setSelectedBrand("");
            setSelectedModel("");
            setSelectedColor("");
            setLoading(false);

            // Navigate to the product page
            navigate(`/product/${result._id}`);
        } catch (err) {
            console.error('Error creating product:', err);
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

    const colors = ['Black', 'White', 'Green', 'Yellow', 'Pink', 'Blue'];

    const phoneModels = {
        iphone: ['12', '12 Pro', '12 Pro Max', '13', '13 Pro', '13 Pro Max', '14', '14 Pro', '14 Pro Max', '15', '15 Pro', '15 Pro Max', '16', '16 Pro', '16 Pro Max'],
        samsung: ['S21', 'S21 Plus', 'S21 Ultra', 'S22', 'S22 Plus', 'S22 Ultra', 'S23', 'S23 Plus', 'S23 Ultra', 'S24', 'S24 Plus', 'S24 Ultra'],
        google: ['Pixel 6', 'Pixel 6 Pro', 'Pixel 7', 'Pixel 7 Pro', 'Pixel 8', 'Pixel 8 Pro'],
    };

    const brands = {
        phone: ['Apple', 'Samsung', 'Google'],
        tv: ['Sony', 'LG', 'Philips'],
        laptop: ['Dell', 'HP', 'Lenovo'],
    };

    const subcategories = ['phone', 'tv', 'laptop'];

    // Get available brands based on subcategory
    const getAvailableBrands = (subcat) => {
        if (subcat && brands[subcat]) {
            return brands[subcat];
        }
        return [];
    };

    // Get available models based on brand (for phones only)
    const getAvailableModels = (brandName) => {
        if (!brandName || selectedSubcategory !== 'phone') return [];
        const brandLower = brandName.toLowerCase();
        if (brandLower.includes('apple')) return phoneModels.iphone;
        if (brandLower.includes('samsung')) return phoneModels.samsung;
        if (brandLower.includes('google')) return phoneModels.google;
        return [];
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-off-white py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Add New Product
                        </h1>
                        <p className="text-gray-600">
                            List your product and reach thousands of potential buyers
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        {/* Mode Toggle */}
                        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                            <button
                                type="button"
                                onClick={() => setAddMode('quick')}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${addMode === 'quick' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                ⚡ Quick Add
                            </button>
                            <button
                                type="button"
                                onClick={() => setAddMode('manual')}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${addMode === 'manual' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                📝 Manual Entry
                            </button>
                        </div>

                        {addMode === 'quick' ? (
                            <div className="space-y-6">
                                {/* Search Bar */}
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search popular products (e.g., iPhone 16, Samsung S24)..."
                                        value={quickSearchTerm}
                                        OnChange={(e) => setQuickSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Product Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                                    {popularProducts
                                        .filter(p => p.name.toLowerCase().includes(quickSearchTerm.toLowerCase()))
                                        .map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() => {
                                                    handleQuickProductSelect(product);
                                                    setAddMode('manual');
                                                }}
                                                className={`cursor-pointer p-1.5 px-4 rounded-xl border-2 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-50 ${selectedQuickProduct?.id === product.id ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-gray-100 bg-gray-50'}`}
                                            >
                                                <div className="font-semibold  text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">{product.brand} • {product.category}</div>
                                            </div>
                                        ))}
                                </div>

                                <div className="text-center text-sm text-gray-500 mt-4">
                                    Can't find what you're looking for? <button type="button" onClick={() => setAddMode('manual')} className="text-emerald-600 font-semibold hover:underline py-2">Switch to Manual Entry</button>
                                </div>
                            </div>
                        ) : (
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
                                        className={errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>
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
                                        className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200 bg-off-white text-gray-800 placeholder-gray-400 resize-none ${errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
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
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                                ₦
                                            </span>
                                            <Input
                                                type="text"
                                                placeholder="0.00"
                                                id="price"
                                                value={displayPrice}
                                                onChange={handlePriceChange}
                                                className={`pl-8 ${errors.price ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                                            />
                                        </div>
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
                                            className={`w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200 bg-off-white text-gray-800 ${errors.category ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
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

                                    {/* Subcategory - Only show for Electronics */}
                                    {category === "Electronics" && (
                                        <div>
                                            <label htmlFor="subcategory" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Subcategory *
                                            </label>
                                            <select
                                                id="subcategory"
                                                {...register("subcategory")}
                                                value={selectedSubcategory}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSelectedSubcategory(value);
                                                    setValue("subcategory", value, { shouldValidate: true });
                                                }}
                                                className={`w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200 bg-off-white text-gray-800 ${errors.subcategory ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                                            >
                                                <option value="">Select subcategory</option>
                                                {subcategories.map((subcat) => (
                                                    <option key={subcat} value={subcat}>
                                                        {subcat.charAt(0).toUpperCase() + subcat.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.subcategory && (
                                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.subcategory.message}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Brand and Model/Color Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Brand - Dynamic options for Electronics */}
                                    <div>
                                        <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Brand *
                                        </label>
                                        {category === "Electronics" && selectedSubcategory ? (
                                            <select
                                                id="brand"
                                                {...register("brand")}
                                                value={selectedBrand}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSelectedBrand(value);
                                                    setValue("brand", value, { shouldValidate: true });
                                                }}
                                                className={`w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200 bg-off-white text-gray-800 ${errors.brand ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                                            >
                                                <option value="">Select brand</option>
                                                {getAvailableBrands(selectedSubcategory).map((brandName) => (
                                                    <option key={brandName} value={brandName}>
                                                        {brandName}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <Input
                                                type="text"
                                                placeholder="Enter brand name"
                                                id="brand"
                                                {...register("brand")}
                                                className={errors.brand ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}
                                            />
                                        )}
                                        {errors.brand && (
                                            <p className="text-red-500 text-xs mt-1 ml-1">{errors.brand.message}</p>
                                        )}
                                    </div>

                                    {/* Model - Only show for phones */}
                                    {selectedSubcategory === 'phone' && selectedBrand && getAvailableModels(selectedBrand).length > 0 ? (
                                        <div>
                                            <label htmlFor="model" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Model
                                            </label>
                                            <select
                                                id="model"
                                                {...register("model")}
                                                value={selectedModel}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSelectedModel(value);
                                                    setValue("model", value, { shouldValidate: true });
                                                }}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200 bg-off-white text-gray-800"
                                            >
                                                <option value="">Select model</option>
                                                {getAvailableModels(selectedBrand).map((modelName) => (
                                                    <option key={modelName} value={modelName}>
                                                        {modelName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        /* Color Dropdown - Show when model is not shown */
                                        <div>
                                            <label htmlFor="color" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Color
                                            </label>
                                            <select
                                                id="color"
                                                {...register("color")}
                                                value={selectedColor}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSelectedColor(value);
                                                    setValue("color", value, { shouldValidate: true });
                                                }}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200 bg-off-white text-gray-800"
                                            >
                                                <option value="">Select color</option>
                                                {colors.map((colorName) => (
                                                    <option key={colorName} value={colorName}>
                                                        {colorName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Color - Show on separate row for phones (after model selection) */}
                                {selectedSubcategory === 'phone' && selectedModel && (
                                    <div>
                                        <label htmlFor="color-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Color
                                        </label>
                                        <select
                                            id="color-phone"
                                            {...register("color")}
                                            value={selectedColor}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setSelectedColor(value);
                                                setValue("color", value, { shouldValidate: true });
                                            }}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200 bg-off-white text-gray-800"
                                        >
                                            <option value="">Select color</option>
                                            {colors.map((colorName) => (
                                                <option key={colorName} value={colorName}>
                                                    {colorName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Live SKU Display */}
                                <div className="bg-gradient-to-r from-emerald-50 to-purple-50 border-2 border-emerald-200 rounded-xl p-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Generated SKU (Stock Keeping Unit)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 bg-white px-4 py-3 rounded-lg border border-gray-200 font-mono text-lg tracking-wider text-emerald-600 font-bold shadow-sm">
                                            {sku || "Generating..."}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-gray-500">Counter</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={skuCounter}
                                                onChange={(e) => setSkuCounter(Number(e.target.value))}
                                                className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-center font-mono focus:border-emerald-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Format: CAT-SUB-BRAND-MODEL-COLOR-COUNTER (e.g., ele-ph-app-iph-13pro-blk-001)
                                    </p>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Images (Max 5) *
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors duration-200 bg-gray-50">
                                        <input
                                            type="file"
                                            id="images"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="images"
                                            className="cursor-pointer flex flex-col items-center gap-3"
                                        >
                                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                                <Image01Icon size={24} />
                                            </div>
                                            <div>
                                                <span className="text-emerald-600 font-semibold hover:text-emerald-700">
                                                    Click to upload
                                                </span>
                                                <span className="text-gray-500"> or drag and drop</span>
                                            </div>
                                            <p className="text-xs text-gray-400">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </label>
                                    </div>

                                    {/* Image Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group aspect-square">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 bg-white/70 text-red-500 rounded-full p-1.5 shadow-md hover:bg-red-50 transition-colors duration-200 border border-gray-100 opacity- group-hover:opacity-100"
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
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-4">

                                    <Button
                                        type="submit"
                                        text={loading ? "Creating..." : "Create Product"}
                                        disabled={loading}
                                        className="w-full py text-white text-base font-semibold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-200"
                                    />
                                    {/* {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Creating Product...</span>
                                            </div>
                                        ) : (
                                            "Create Product"
                                        )}
                                    </Button> */}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
