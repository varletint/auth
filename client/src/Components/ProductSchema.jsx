/**
 * ProductSchema - Generate JSON-LD structured data for products
 * 
 * Usage: Pass the product object and get back Schema.org Product structured data
 * 
 * @param {object} product - Product object from API
 * @param {object} seller - Seller information
 * @returns {object} JSON-LD structured data object
 */
export function generateProductSchema(product, seller = null) {
    if (!product) return null;

    const baseUrl = "https://lookupss.vercel.app";
    const sellerUsername = seller?.username || product.userId?.username;

    // Determine availability
    let availability = "https://schema.org/InStock";
    if (product.stock === 0) {
        availability = "https://schema.org/OutOfStock";
    } else if (product.stockStatus === "low_stock") {
        availability = "https://schema.org/LimitedAvailability";
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description || `Buy ${product.name} online at Lookups`,
        "sku": product.sku || undefined,
        "image": product.images?.[0] || undefined,
        "url": sellerUsername
            ? `${baseUrl}/${sellerUsername}/${product.slug}`
            : `${baseUrl}/product/${product._id}`,
        "brand": product.brand ? {
            "@type": "Brand",
            "name": product.brand
        } : undefined,
        "category": product.category,
        "offers": {
            "@type": "Offer",
            "url": sellerUsername
                ? `${baseUrl}/${sellerUsername}/${product.slug}`
                : `${baseUrl}/product/${product._id}`,
            "priceCurrency": product.currency || "NGN",
            "price": product.salePrice || product.price,
            "availability": availability,
            "itemCondition": "https://schema.org/NewCondition",
            "seller": seller ? {
                "@type": "Organization",
                "name": seller.fullname || seller.username || "Lookups Seller",
                "url": `${baseUrl}/store/${sellerUsername}`
            } : undefined
        }
    };

    // Add aggregate rating if available
    if (product.reviewCount > 0 && product.averageRating > 0) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": product.averageRating.toFixed(1),
            "reviewCount": product.reviewCount
        };
    }

    // Clean up undefined values
    const cleanSchema = JSON.parse(JSON.stringify(schema));

    return cleanSchema;
}

/**
 * CategorySchema - Generate JSON-LD for category pages
 */
export function generateCategorySchema(categoryName, productCount) {
    const baseUrl = "https://lookupss.vercel.app";
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${categoryName} Products`,
        "description": `Browse ${productCount} products in ${categoryName} category on Lookups`,
        "url": `${baseUrl}/category/${slug}`,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": productCount,
            "itemListElement": [] // Products would be added dynamically
        }
    };
}

/**
 * SellerSchema - Generate JSON-LD for seller store pages
 */
export function generateSellerSchema(seller) {
    if (!seller) return null;

    const baseUrl = "https://lookupss.vercel.app";

    return {
        "@context": "https://schema.org",
        "@type": "Store",
        "name": seller.fullname || seller.username,
        "url": `${baseUrl}/store/${seller.username}`,
        "description": `Shop products from ${seller.fullname || seller.username} on Lookups`,
        "numberOfEmployees": 1,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/search?seller=${seller.username}&q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };
}

export default {
    generateProductSchema,
    generateCategorySchema,
    generateSellerSchema
};
