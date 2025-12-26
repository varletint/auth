import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import Button from "../Components/Button";
import { productApi } from "../api/productApi";
import { wishlistApi } from "../api/wishlistApi";
import { cartApi } from "../api/cartApi";
import {
    ShoppingCart01Icon,
    Mail01Icon,
    Location01Icon,
    UserIcon,
    StarIcon,
    Share08Icon,
    ArrowLeft01Icon,
    PackageIcon,
    CheckmarkCircle02Icon,
    FavouriteIcon,
    Loading03Icon,
    ViewIcon,
    ShoppingCartAdd01Icon,
} from "hugeicons-react";
import Footer from "../Components/Footer";
import { generateProductSchema } from "../Components/ProductSchema";

export default function ProductPage() {
    // Support both URL patterns:
    // 1. SEO-friendly: /:seller/:slug (e.g., /techstore/iphone-15-pro)
    // 2. ID-based: /product/:id (e.g., /product/507f1f77...)
    const { id, seller, slug } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuthStore();

    // Redirect business_management users to BizDashboard


    const [product, setProduct] = useState(null);
    const [sellerInfo, setSellerInfo] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [inWishlist, setInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Toast notification state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    if (currentUser && currentUser.appType === "business_management") {
        return <Navigate to="/biz-dashboard" replace />;
    }

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const BASE_URL = 'https://lookupsbackend.vercel.app'

    // Fetch product when route params change
    useEffect(() => {
        fetchProductDetails();
    }, [id, seller, slug]);

    // Check if product is in wishlist
    useEffect(() => {
        const checkWishlist = async () => {
            if (currentUser && id) {
                try {
                    const response = await wishlistApi.checkWishlistItem(id);
                    setInWishlist(response.inWishlist);
                } catch (err) {
                    // Silent fail for wishlist check
                }
            }
        };
        checkWishlist();
    }, [currentUser, id, product?._id]);

    /**
     * Fetch product details - supports both URL patterns:
     * 1. SEO-friendly: /:seller/:slug → calls getProductBySlug API
     * 2. ID-based: /product/:id → calls getProduct API + soft redirect
     */
    const fetchProductDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            let productData;
            let sellerData = null;
            let canonicalUrl = null;

            // Determine which API to call based on URL pattern
            if (seller && slug) {
                // SEO-friendly URL: /:seller/:slug
                // Call the slug-based API
                const response = await fetch(`${BASE_URL}/api/products/slug/${seller}/${slug}`);
                if (!response.ok) {
                    throw new Error("Product not found");
                }
                const data = await response.json();
                productData = data.product;
                sellerData = data.seller;
                canonicalUrl = data.canonicalUrl;
            } else if (id) {
                // ID-based URL: /product/:id
                // Call the ID-based API
                const response = await fetch(`${BASE_URL}/api/products/${id}`);
                if (!response.ok) {
                    throw new Error("Product not found");
                }
                const data = await response.json();
                productData = data.product || data; // Handle both response formats
                canonicalUrl = data.canonicalUrl;

                // =========================================
                // SOFT REDIRECT: Update browser URL to SEO-friendly version
                // =========================================
                // This updates the URL without page reload, good for SEO
                if (canonicalUrl) {
                    window.history.replaceState(null, '', canonicalUrl);
                }
            } else {
                throw new Error("Invalid URL parameters");
            }

            if (!productData) {
                throw new Error("Product not found");
            }

            setProduct(productData);

            // Fetch seller info if not already provided
            if (!sellerData && productData.userId) {
                try {
                    const sellerId = typeof productData.userId === 'object'
                        ? productData.userId._id
                        : productData.userId;
                    const sellerRes = await fetch(`${BASE_URL}/api/seller/${sellerId}`);
                    if (sellerRes.ok) {
                        sellerData = await sellerRes.json();
                    }
                } catch (err) {
                    // Silent fail for seller info
                }
            }
            setSellerInfo(sellerData);

            // Fetch related products
            if (productData.category) {
                try {
                    const relatedResponse = await productApi.getProducts({
                        category: productData.category,
                        limit: 4
                    });

                    if (relatedResponse && relatedResponse.products) {
                        const filtered = relatedResponse.products.filter(
                            (p) => p._id !== productData._id
                        );
                        setRelatedProducts(filtered.slice(0, 3));
                    }
                } catch (err) {
                    // Silent fail for related products
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const [addingToCart, setAddingToCart] = useState(false);

    const handleAddToCart = async () => {
        if (!product) return;

        if (!currentUser) {
            navigate("/login", { state: { from: `/product/${id}` } });
            return;
        }

        try {
            setAddingToCart(true);

            // Re-fetch product to get the latest stock
            const latestProduct = await productApi.getProduct(id);

            if (!latestProduct) {
                showToast("Product not found", "error");
                return;
            }

            // Update local product state with latest data
            setProduct(latestProduct);

            // Check if product is in stock with latest data
            if (latestProduct.stock !== undefined && latestProduct.stock < quantity) {
                showToast(latestProduct.stock === 0
                    ? "This product is out of stock"
                    : `Only ${latestProduct.stock} items available in stock. Please reduce your quantity.`, "error");
                // Adjust quantity if it exceeds new stock
                if (quantity > latestProduct.stock) {
                    setQuantity(Math.max(1, latestProduct.stock));
                }
                return;
            }

            await cartApi.addToCart(product._id, quantity);
            showToast(`${quantity} ${product.name}(s) added to cart!`, "success");
        } catch (err) {
            showToast(err.message || "Failed to add to cart", "error");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleContactSeller = () => {
        if (sellerInfo?.email) {
            window.location.href = `mailto:${sellerInfo.email}?subject=Inquiry about ${product.name}`;
        } else {
            showToast("Seller contact information not available", "error");
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: `${product.description.substring(0, 100)}... \n\n`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast("Product link copied to clipboard!", "success");
        }
    };

    const handleWishlistToggle = async () => {
        if (!currentUser) {
            navigate("/login", { state: { from: `/product/${id}` } });
            return;
        }

        try {
            setWishlistLoading(true);
            if (inWishlist) {
                await wishlistApi.removeFromWishlist(id);
                setInWishlist(false);
            } else {
                await wishlistApi.addToWishlist(id);
                setInWishlist(true);
            }
        } catch (err) {
            showToast(err.message || "Wishlist action failed", "error");
        } finally {
            setWishlistLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white">
                <Loading03Icon size={48} className="text-emerald-600 animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
                    <Button text="Go Back" onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-600-dark" />
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ${toast.type === 'success'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 text-white'
                    }`}>
                    <div className="flex items-center gap-2">
                        {toast.type === 'success' ? (
                            <CheckmarkCircle02Icon size={20} />
                        ) : (
                            <span className="text-lg">⚠️</span>
                        )}
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-off-white">
                <Helmet>
                    <title>{product.name} | Lookups</title>
                    <meta name="description" content={product.description?.substring(0, 160) || `Buy ${product.name} at the best price on Lookups.`} />
                    <meta name="keywords" content={`${product.name}, ${product.category}, ${product.brand || ''}, buy online, lookups`} />
                    <meta property="og:title" content={`${product.name} | Lookups`} />
                    <meta property="og:description" content={product.description?.substring(0, 160) || `Buy ${product.name} on Lookups`} />
                    <meta property="og:type" content="product" />
                    <meta property="og:url" content={`https://lookupss.vercel.app/product/${product._id}`} />
                    <meta property="og:image" content={product.images?.[0] || ''} />
                    <meta property="og:site_name" content="Lookups" />
                    <meta property="product:price:amount" content={product.price} />
                    <meta property="product:price:currency" content="NGN" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={`${product.name} | Lookups`} />
                    <meta name="twitter:description" content={product.description?.substring(0, 160) || `Buy ${product.name} on Lookups`} />
                    <meta name="twitter:image" content={product.images?.[0] || ''} />
                    <link rel="canonical" href={sellerInfo?.username ? `https://lookupss.vercel.app/${sellerInfo.username}/${product.slug}` : `https://lookupss.vercel.app/product/${product._id}`} />
                    {/* JSON-LD Structured Data for Rich Snippets */}
                    <script type="application/ld+json">
                        {JSON.stringify(generateProductSchema(product, sellerInfo))}
                    </script>
                </Helmet>

                {/* Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2"
                            >
                                <ArrowLeft01Icon size={20} />
                                <span className="font-medium">Back</span>
                            </button>
                            <Link to="/cart" className="">
                                <ShoppingCart01Icon size={20} className="text-emerald-600 " />
                            </Link>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2"
                            >
                                <Share08Icon size={20} />
                                <span className="font-medium">Share</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        {/* Product Images */}
                        <div className="space-y-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden aspect-square">
                                <img
                                    src={product.images?.[selectedImage] || "https://via.placeholder.com/600"}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all py-2 ${selectedImage === index
                                                ? "border-blue-600 ring-2 ring-primary/20"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="space-y-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-3 py-1 bg-emerald-600/10 text-emerald-600 text-sm font-medium rounded-full">
                                        {product.category}
                                    </span>

                                    {product.brand && (
                                        <span className="px-3 py-1 bg-emerald-600/10 text-emerald-600 text-sm font-medium rounded-full">
                                            {product.brand}
                                        </span>
                                    )}
                                    {product.stock > 0 ? (
                                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                            <CheckmarkCircle02Icon size={16} />
                                            In Stock
                                        </span>
                                    ) : (
                                        <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name} </h1>
                                <div className="flex items-center gap-2 ">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon
                                                key={i}
                                                size={18}
                                                className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                            />
                                        ))}
                                        <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                                        <ViewIcon size={18} />
                                        <span>{product.viewCount || 0} views</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-b border-gray-200 py-1.5">
                                <div className="inline-block items-baseline gap-3">
                                    <p className="text-2xl font-bold
                                 text-emerald-600 mb-1">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(product.price)}</p>
                                    <p>

                                        {product.sku && <span className="text-sm text-gray-500 text-nowrap">SKU: {product.sku}</span>}
                                    </p>
                                </div>
                            </div>

                            {product.description && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-1">
                                <PackageIcon size={20} className="text-gray-400" />
                                <span className="text-sm text-gray-600">Stock Available: {product.stock} units</span>
                            </div>
                            <div className="flex flex-col gap-2.5 ">
                                {/* Quantity Selector */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-off-white font-semibold py-2"
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                            className="w-20 h-10 text-center border border-gray-300 rounded-lg font-semibold"
                                            min="1"
                                            max={product.stock}
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-off-white font-semibold py-2"
                                            disabled={quantity >= product.stock}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        text={
                                            <span className="flex items-center gap-2">
                                                {addingToCart ? (
                                                    <Loading03Icon size={20} className="animate-spin" />
                                                ) : (
                                                    <ShoppingCartAdd01Icon size={20} />
                                                )}
                                            </span>
                                        }
                                        onClick={handleAddToCart}
                                        className="flex bg-blue-600 
                                    hover:bg-blue-600-dark 
                                    justify-center  w-16 h-10"
                                        disabled={product.stock === 0 || addingToCart}
                                    />
                                    <Button
                                        text={
                                            <span className="flex justify-center">
                                                <Mail01Icon size={20} />
                                                {/* Contact */}
                                            </span>
                                        }
                                        onClick={handleContactSeller}
                                        className=" bg-white !text-gray-700 
                                    border border-gray-200 hover:bg-off-white 
                                    !shadow-sm w-16 h-10"
                                    />
                                    <button
                                        onClick={handleWishlistToggle}
                                        disabled={wishlistLoading}
                                        className={`w-16 h-10 rounded-lg border flex items-center justify-center transition-all py-2 ${inWishlist
                                            ? "bg-red-50 border-red-200 text-red-500"
                                            : "bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                                            } ${wishlistLoading ? "opacity-50" : ""}`}
                                        title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                                    >
                                        <FavouriteIcon
                                            size={24}
                                            className={inWishlist ? "fill-red-500" : ""}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seller Information */}
                    {sellerInfo && (
                        <div className="bg-white rounded-2xl shadow-sm border 
                    border-gray-200 px-3 py-2.5 mb-3 w-fit">
                            {/* <h2 className="text- font-bold text-gray-900 mb-6">Seller Information</h2> */}
                            <div className="flex flex-co sm:flex-row items-start gap-6">
                                <Link to={`/seller/${sellerInfo.username}`}
                                    className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center 
                            text-2xl font-bold text-blue-500 flex-shrink-0 uppercase text-nowrap">
                                    {sellerInfo.username?.[0] || sellerInfo.fullname?.[0] || "S"}
                                </Link>
                                <div className="flex-1 w-full sm:w-auto">
                                    <h3 className="text-sm font-semibold text-gray-900 text-nowrap">{sellerInfo.fullName || sellerInfo.username || "Seller"}</h3>
                                    {sellerInfo.businessInfo?.businessName && (
                                        <p className="text-sm text-gray-600 mb-2 text-nowrap">{sellerInfo.businessInfo.businessName}</p>
                                    )}
                                    <div className="flex flex-wrap gap-4 mt-3">
                                        {sellerInfo.email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail01Icon size={16} className="text-gray-400" />
                                                <span className="break-all">{sellerInfo.email}</span>
                                            </div>
                                        )}
                                        {sellerInfo.phone_no && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <UserIcon size={16} className="text-gray-400" />
                                                {sellerInfo.phone_no}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* <Button
                                text="View Profile"
                                onClick={() => navigate(`/seller/${sellerInfo._id}`)}
                                className="bg-blue-600 hover:bg-blue-600-dark !py-2 !px-4 !text-sm w-full sm:w-auto"
                            /> */}
                            </div>
                        </div>
                    )}

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div>
                            <h2 className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">Related Products</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct._id}
                                        to={`/product/${relatedProduct._id}`}
                                        className=" w-40"
                                    >
                                        {/* <Link
                                    key={relatedProduct._id}
                                    to={`/product/${relatedProduct._id}`}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all"
                                > */}
                                        <div className="a{spect-square/} 
                                    card bg-gray-200 overflow-hidden">
                                            <img
                                                src={relatedProduct.images?.[0] || "https://via.placeholder.com/400"}
                                                alt={relatedProduct.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-1">
                                            <h3 className="font-semibold text-gray-900 line-/clamp-2 truncate text-xs 
                                        sm:text-sm md:text-base">{relatedProduct.name}</h3>
                                            <p className="text-sm font-semibold text-gray-500">{relatedProduct.category}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-emerald-600">
                                                    {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(relatedProduct.price)}
                                                </span>
                                                {relatedProduct.stock > 0 && (
                                                    <span className="text-xs text-green-600 font-medium">In Stock</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
