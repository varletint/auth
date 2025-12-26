import express from "express";
import {
    getCategories,
    getCategoryProducts,
    getSellers,
    getSellerProfile,
    getSitemapIndex,
    getProductsSitemap,
    getCategoriesSitemap,
    getSellersSitemap
} from "../controller/seoController.js";

const router = express.Router();

// Category routes
router.get("/categories", getCategories);
router.get("/category/:slug", getCategoryProducts);

// Seller routes
router.get("/sellers", getSellers);
router.get("/seller/:username", getSellerProfile);

// Sitemap routes (XML)
router.get("/sitemap.xml", getSitemapIndex);
router.get("/sitemap-products.xml", getProductsSitemap);
router.get("/sitemap-categories.xml", getCategoriesSitemap);
router.get("/sitemap-sellers.xml", getSellersSitemap);

export default router;
