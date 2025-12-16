import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import Button from "../Components/Button";
import { productApi } from "../api/productApi";
import useAuthStore from "../store/useAuthStore";
import {
    Mail01Icon,
    Location01Icon,
    UserIcon,
    Share08Icon,
    ArrowLeft01Icon,
    PackageIcon,
    Calendar03Icon,
    CallIcon,
    Link01Icon,
    Store01Icon,
    Loading03Icon,
} from "hugeicons-react";

export default function UserPage() {
    const { currentUser } = useAuthStore();
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productsLoading, setProductsLoading] = useState(true);
    const [tempId, setTempId] = useState('');
    console.log(tempId);


    const BASE_URL = 'https://lookupsbackend.vercel.app';

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch user information
                const userRes = await fetch(`${BASE_URL}/api/seller/${id}`);
                if (!userRes.ok) throw new Error("User not found");
                const userData = await userRes.json();
                setUser(userData);
                setTempId(userData._id);

                // Fetch user's products
                setProductsLoading(true);
                try {
                    const productsResponse = await productApi.getProducts({
                        username: id,
                        limit: 50
                    });

                    if (productsResponse && productsResponse.products) {
                        setProducts(productsResponse.products);
                    }
                } catch (err) {
                    console.log("Could not fetch user products:", err);
                } finally {
                    setProductsLoading(false);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    // Redirect business_management users to BizDashboard
    if (currentUser && currentUser.appType === "business_management") {
        return <Navigate to="/biz-dashboard" replace />;
    }



    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${user.username}'s Profile`,
                text: `Check out ${user.username}'s profile and products!`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Profile link copied to clipboard!");
        }
    };

    const handleContactEmail = () => {
        if (user?.email || user?.businessInfo?.businessEmail) {
            const email = user.businessInfo?.businessEmail || user.email;
            window.location.href = `mailto:${email}`;
        }
    };

    const handleContactPhone = () => {
        if (user?.phone_no || user?.businessInfo?.businessPhone) {
            const phone = user.businessInfo?.businessPhone || user.phone_no;
            window.location.href = `tel:${phone}`;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white">
                <Loading03Icon size={48} className="text-emerald-600 animate-spin" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-off-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The user you're looking for doesn't exist."}</p>
                    <Button text="Go Back" onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-600-dark" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* SEO Meta Tags */}
            {user && (
                <Helmet>
                    <title>{user.fullName || user.username} | Lookups Seller</title>
                    <meta name="description" content={user.bio || `Check out ${user.username}'s products on Lookups. ${products.length} products available.`} />

                    {/* Open Graph */}
                    <meta property="og:title" content={`${user.fullName || user.username} | Lookups Seller`} />
                    <meta property="og:description" content={user.bio || `Shop ${products.length} products from ${user.username}`} />
                    <meta property="og:type" content="profile" />
                    <meta property="og:url" content={`https://lookupss.vercel.app/seller/${id}`} />
                    <meta property="og:site_name" content="Lookups" />

                    {/* Twitter Card */}
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:title" content={`${user.fullName || user.username} | Lookups`} />
                    <meta name="twitter:description" content={user.bio || `Shop products from ${user.username}`} />

                    <link rel="canonical" href={`https://lookupss.vercel.app/seller/${id}`} />
                </Helmet>
            )}

            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2"
                        >
                            <ArrowLeft01Icon size={20} />
                            <span className="font-medium">Back</span>
                        </button>
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
            <div className="max-w-7xl mx-auto px- sm:px-6 lg:px-8 py">
                {/* User Profile Section */}
                <div className="bg-whit px-3 py-2 mb-">
                    <div className="flex flex-col gap-2">
                        {/* Avatar */}
                        <div className="flex justify-between">
                            <div className="shrink-0">
                                <div className="w-18 h-18 md:w-24 md:h-24 rounded-full bg-linear-to-br from-emerald-300 to-emerald-800 flex items-center justify-center text-4xl font-bold text-white uppercase shadow-lg">
                                    {user.username?.[0] || user.fullName?.[0] || "U"}
                                </div>
                            </div>
                            {/* Contact Buttons */}
                            <div className="flex flex-wrap gap-3">
                                {(user.email || user.businessInfo?.businessEmail) && (

                                    <button
                                        onClick={handleContactEmail}
                                        className="flex items-center gap-2 px-6 py-2 text-sm font-bold 
                                         bg-emerald-600 hover:bg-emerald-600-dark h-9 sm:h-10
                                         text-white transition-colors rounded-full"
                                    >
                                        <Mail01Icon size={18} />
                                        Email
                                    </button>
                                )}
                                {(user.phone_no || user.businessInfo?.businessPhone) && (
                                    <Button
                                        text={
                                            <span className="flex items-center gap-2">
                                                <CallIcon size={18} />
                                                Call
                                            </span>
                                        }
                                        onClick={handleContactPhone}
                                        className="bg-white !text-gray-700 border border-gray-200 hover:bg-off-white !shadow-sm !py-2 !px-4 !text-sm"
                                    />
                                )}
                                {user.socialMedia?.website && (
                                    <a
                                        href={user.socialMedia.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-off-white transition-colors"
                                    >
                                        <Link01Icon size={18} />
                                        Website
                                    </a>
                                )}
                            </div>

                        </div>

                        {/* User Info */}
                        <div className="flex-1 ">
                            <div className="flex gap-2">
                                <div className="">
                                    <div className=" flex  items-center gap-1">


                                        <h1 className="text-xl sm:text-xl md font-bold
                                         text-gray-900 text-nowrap capitalize">
                                            {user.fullName || user.username} {" "}
                                            {/* {user.role && (
                                            <span className="px-0.5 py-0.5 bg-emerald-600/10 text-emerald-600 text-sm font-medium rounded-full mt-2 sm:mt-0 inline-block">
                                                {user.role[0][0] || user.role}
                                            </span>
                                        )} */}

                                        </h1>
                                        <div className="w-6 h-3 rounded-full bg-emerald-600/50"></div>
                                    </div>

                                    <p className="text-gray-600 text-lg">@{user.username}</p>
                                </div>

                            </div>
                            <div className=" flex-col= flex sm:flex-row items-center justify-between mb-2 inline-block=">
                                {/* <div className=" flex-col sm:flex-row sm:items-center sm:justify-between mb-4 inline-block"> */}
                                {/* <div className="flex  flex-col -gap-1 ">


                                    <h1 className="text-lg sm:text-xl md font-bold text-gray-900 text-nowrap">
                                        {user.fullName || user.username}
                                    </h1>
                                    {user.fullName && (
                                        <p className="text-gray-600 text-sm">@{user.username}</p>
                                    )}
                                </div> */}
                                {/* {user.role && (
                                    <span className="px-4 py-2 bg-emerald-600/10 text-emerald-600 text-sm font-medium rounded-full mt-2 sm:mt-0 inline-block">
                                        {user.role[0] || user.role}
                                    </span>
                                )} */}
                            </div>

                            {user.bio && (
                                <p className="text-gray-700 mb- leading-relaxed">{user.bio}</p>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-">
                                {user.location?.city && (
                                    <div className="flex items-center gap-2">
                                        <Location01Icon size={16} className="text-gray-400" />
                                        <span>{user.location.city}{user.location.country?.name ? `, ${user.location.country.name}` : ''}</span>
                                    </div>
                                )}
                                {user.createdAt && (
                                    <div className="flex items-center gap-2">
                                        <Calendar03Icon size={16} className="text-gray-400" />
                                        <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <PackageIcon size={16} className="text-gray-400" />
                                    <span>{products.length} Products</span>
                                </div>
                            </div>

                            {/* Contact Buttons */}
                            {/* <div className="flex flex-wrap gap-3">
                                {(user.email || user.businessInfo?.businessEmail) && (
                                    <Button
                                        text={
                                            <span className="flex items-center gap-2">
                                                <Mail01Icon size={18} />
                                                Email
                                            </span>
                                        }
                                        onClick={handleContactEmail}
                                        className="bg-blue-600 hover:bg-blue-600-dark !py-2 !px-4 !text-sm"
                                    />
                                )}
                                {(user.phone_no || user.businessInfo?.businessPhone) && (
                                    <Button
                                        text={
                                            <span className="flex items-center gap-2">
                                                <CallIcon size={18} />
                                                Call
                                            </span>
                                        }
                                        onClick={handleContactPhone}
                                        className="bg-white !text-gray-700 border border-gray-200 hover:bg-off-white !shadow-sm !py-2 !px-4 !text-sm"
                                    />
                                )}
                                {user.socialMedia?.website && (
                                    <a
                                        href={user.socialMedia.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-off-white transition-colors"
                                    >
                                        <Link01Icon size={18} />
                                        Website
                                    </a>
                                )}
                            </div> */}
                        </div>
                    </div>
                </div>

                <svg width="100%" height="1" className="">
                    <line x1="0" y1="0" x2="100%" y2="0" stroke="lightgray" strokeWidth="1" />
                </svg>
                {/* Business Information */}
                {user.businessInfo && (user.businessInfo.businessName || user.businessInfo.businessEmail || user.businessInfo.businessPhone || user.businessInfo.businessAddress) && (
                    <div className="bg-white px-3 py-2 mb-">
                        <div className="flex items-center gap-2 mb-4">
                            <Store01Icon size={24} className="text-gray-400" />
                            <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-">
                            {user.businessInfo.businessName && (
                                <div>
                                    <p className="text-sm text-gray-500 ">Business Name</p>
                                    <p className="text-gray-900 font-medium first-letter:capitalize">{user.businessInfo.businessName}</p>
                                </div>
                            )}
                            {user.businessInfo.businessEmail && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Business Email</p>
                                    <a href={`mailto:${user.businessInfo.businessEmail}`} className="text-blue-600 hover:underline">
                                        {user.businessInfo.businessEmail}
                                    </a>
                                </div>
                            )}
                            {user.businessInfo.businessPhone && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Business Phone</p>
                                    <a href={`tel:${user.businessInfo.businessPhone}`} className="text-blue-600 hover:underline">
                                        {user.businessInfo.businessPhone}
                                    </a>
                                </div>
                            )}
                            {user.businessInfo.businessAddress && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Business Address</p>
                                    <p className="text-gray-900">{user.businessInfo.businessAddress}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <svg width="100%" height="1" className="">
                    <line x1="0" y1="0" x2="100%" y2="0" stroke="lightgray" strokeWidth="1" />
                </svg>
                {/* Products Section */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2 px-3 py-2">
                        Products ({products.length})
                    </h2>

                    {productsLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                                    <div className="aspect-square bg-gray-200"></div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className=" flex flex-col items-center justify-center w-full px-3 ">
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {products.map((product) => (
                                    <Link
                                        key={product._id}
                                        to={`/product/${product._id}`}
                                        className="bg-white  overflow-hidden group hover:shadow-md transition-all"
                                    >
                                        <div className="aspect-[1.1/1] bg-gray-200 overflow-hidden">
                                            <img
                                                src={product.images?.[0] || "https://via.placeholder.com/400"}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-1.5">
                                            <h3 className="font-semibold text-xs  text-gray-900 mb- line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 font-semibold">{product.category}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-emerald-600">
                                                    {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(product.price)}
                                                </span>
                                                {product.stock > 0 && (
                                                    <span className="text-xs text-green-600 font-medium">In Stock</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <PackageIcon size={48} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
                            <p className="text-gray-600">This user hasn't posted any products.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
