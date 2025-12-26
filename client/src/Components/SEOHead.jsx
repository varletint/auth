import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * SEOHead - Reusable component for SEO meta tags
 * 
 * @param {string} title - Page title
 * @param {string} description - Meta description (max 160 chars recommended)
 * @param {string} url - Canonical URL
 * @param {string} image - OG image URL
 * @param {string} type - OG type (default: "website")
 * @param {object} structuredData - JSON-LD structured data object
 */
export default function SEOHead({
    title,
    description,
    url,
    image,
    type = "website",
    structuredData = null
}) {
    const siteName = "Lookups";
    const defaultImage = "https://lookupss.vercel.app/logo.png";
    const baseUrl = "https://lookupss.vercel.app";

    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
    const ogImage = image || defaultImage;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || `Shop on ${siteName} - Your trusted marketplace`} />

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || `Shop on ${siteName}`} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || `Shop on ${siteName}`} />
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data (JSON-LD) */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
}
