import React from "react";
import { Link } from "react-router-dom";
import {
    ShoppingCart01Icon,
    FavouriteIcon,
    ViewIcon,
    StarIcon,
} from "hugeicons-react";

/**
 * ProductCard Component
 * Displays a single product with image, details, and actions.
 *
 * @param {Object} props
 * @param {Object} props.product - The product data to display
 * @param {Function} props.onAddToCart - Handler for adding to cart
 * @param {Function} props.onToggleWishlist - Handler for wishlist toggle
 * @param {boolean} props.isInWishlist - Whether product is in wishlist
 */
const ProductCard = ({
    product,
    onAddToCart,
    onToggleWishlist,
    isInWishlist = false,
}) => {
    const {
        _id,
        name,
        price,
        images,
        rating = 4.0,
        viewCount = 0,
        stock,
        discountPercentage = 0,
        oldPrice
    } = product;

    return (
        <div className="group bg-white rounded bg-white hover:shadow-[0_2px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 overflow-hidden relative flex flex-col h-full border border-transparent hover:border-gray-200">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
                <Link to={`/product/${_id}`}>
                    <img
                        src={images?.[0] || "https://via.placeholder.com/400"}
                        alt={name}
                        className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-sm">
                        -{discountPercentage}%
                    </span>
                )}

                {/* Wishlist Button (Hidden by default, visible on hover) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onToggleWishlist && onToggleWishlist(_id);
                    }}
                    className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ${isInWishlist
                            ? "bg-red-50 text-red-500"
                            : "bg-white text-gray-500 hover:text-emerald-500"
                        }`}
                >
                    <FavouriteIcon
                        size={18}
                        className={isInWishlist ? "fill-current" : ""}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="p-2 flex flex-col flex-grow">
                <Link to={`/product/${_id}`} className="block mb-1">
                    <h3 className="text-sm text-gray-700 font-normal truncate group-hover:text-emerald-600 transition-colors">
                        {name}
                    </h3>
                </Link>

                {/* Price Section */}
                <div className="mt-1 mb-1">
                    <div className="text-base font-bold text-gray-900">
                        {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                        }).format(price)}
                    </div>
                    {oldPrice && (
                        <div className="text-xs text-gray-500 line-through">
                            {new Intl.NumberFormat("en-NG", {
                                style: "currency",
                                currency: "NGN",
                            }).format(oldPrice)}
                        </div>
                    )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <StarIcon
                            key={i}
                            size={12}
                            className={i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                    ))}
                    <span className="text-xs text-gray-500">({viewCount})</span>
                </div>

                {/* Add to Cart Button (Full width on hover sort of feel, but Jumia keeps it simple usually. Let's make it an emerald button) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onAddToCart && onAddToCart(product);
                    }}
                    disabled={stock === 0}
                    className="w-full mt-auto bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                    {stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
