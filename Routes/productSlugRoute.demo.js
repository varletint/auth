/**
 * Smart Redirect Demo: SEO-Friendly Product URLs
 * ================================================
 * 
 * This file demonstrates how to support BOTH URL patterns:
 * 
 * 1. SEO-friendly:  /:sellerUsername/:productSlug  → /techstore/iphone-15-pro
 * 2. ID-based:      /product/:id                   → /product/507f1f77bcf86cd799439011
 * 
 * The ID-based route can optionally redirect to the SEO-friendly URL (301 redirect)
 * for better SEO consolidation.
 */

import express from "express";
import Product from "../Models/product.js";
import User from "../Models/user.js";

const router = express.Router();

// ============================================
// ROUTE 1: SEO-Friendly URL (Primary)
// GET /:sellerUsername/:productSlug
// ============================================
// Example: /techstore/iphone-15-pro-max
// 
// This is the URL you want users to share and search engines to index.

router.get("/:sellerUsername/:productSlug", async (req, res) => {
    try {
        const { sellerUsername, productSlug } = req.params;

        // Step 1: Find the seller by username
        const seller = await User.findOne({
            username: sellerUsername.toLowerCase(),
            accountStatus: "active"
        });

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        // Step 2: Find the product by slug AND seller ID (ensures uniqueness per seller)
        const product = await Product.findOne({
            slug: productSlug.toLowerCase(),
            userId: seller._id,
            isActive: true,
            status: "published"
        }).populate("userId", "username email phone_no");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Return product with seller info
        res.status(200).json({
            success: true,
            data: {
                product,
                seller: {
                    username: seller.username,
                    // Add other seller fields as needed
                },
                // Include canonical URL for frontend to use
                canonicalUrl: `/${seller.username}/${product.slug}`
            }
        });

    } catch (error) {
        console.error("Error fetching product by slug:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});


// ============================================
// ROUTE 2: ID-Based URL with Smart Redirect (Fallback)
// GET /product/:id
// ============================================
// Example: /product/507f1f77bcf86cd799439011
//
// OPTIONS:
// - Option A: Return product directly (current behavior)
// - Option B: 301 Redirect to SEO-friendly URL (better for SEO)
// - Option C: Return product + redirect URL for frontend to handle

// Option A: Return product directly (no redirect)
router.get("/product/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate("userId", "username email phone_no");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Get seller username for canonical URL
        const sellerUsername = product.userId?.username;

        res.status(200).json({
            success: true,
            data: {
                product,
                // Include the SEO-friendly URL for the frontend to use
                canonicalUrl: sellerUsername ? `/${sellerUsername}/${product.slug}` : null,
                // Or use for <link rel="canonical"> in your HTML head
            }
        });

    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});


// Option B: 301 Redirect to SEO-friendly URL (Uncomment to use)
/*
router.get("/product/:id/redirect", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("userId", "username");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const sellerUsername = product.userId?.username;

    if (sellerUsername && product.slug) {
      // 301 Permanent Redirect - tells search engines to update their index
      return res.redirect(301, `/${sellerUsername}/${product.slug}`);
    }

    // Fallback: return product if redirect not possible
    res.status(200).json({ success: true, data: product });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
*/


// ============================================
// HELPER: Build SEO-friendly URL from product
// ============================================
// Use this in your controllers to generate URLs for links

export const buildProductUrl = (product, seller) => {
    const username = seller?.username || product?.userId?.username;
    const slug = product?.slug;

    if (username && slug) {
        return `/${username}/${slug}`;
    }

    // Fallback to ID-based URL
    return `/product/${product._id}`;
};


// ============================================
// FRONTEND ROUTING (React Router example)
// ============================================
/*
// In your App.jsx or routes file:

import { Routes, Route } from 'react-router-dom';
import ProductPage from './Pages/ProductPage';

<Routes>
  {/* SEO-friendly route (primary) *}
  <Route path="/:sellerUsername/:productSlug" element={<ProductPage />} />
  
  {/* ID-based route (fallback - can redirect to SEO-friendly) *}
  <Route path="/product/:id" element={<ProductPage />} />
</Routes>

// In ProductPage.jsx:
const { sellerUsername, productSlug, id } = useParams();

useEffect(() => {
  if (id) {
    // Fetch by ID, then optionally redirect to SEO URL
    fetchProductById(id).then(product => {
      if (product.canonicalUrl) {
        // Replace URL in browser without reload (for SEO)
        window.history.replaceState(null, '', product.canonicalUrl);
      }
    });
  } else if (sellerUsername && productSlug) {
    // Fetch by slug (preferred)
    fetchProductBySlug(sellerUsername, productSlug);
  }
}, [id, sellerUsername, productSlug]);
*/

export default router;
