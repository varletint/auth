import Product from "../Models/product.js";
import User from "../Models/user.js";

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Product.aggregate([
            { $match: { isActive: true, status: "published" } },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    slug: { $first: { $toLower: "$category" } }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const formattedCategories = categories.map(cat => ({
            name: cat._id,
            slug: cat._id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
            productCount: cat.count
        }));

        res.status(200).json({
            success: true,
            categories: formattedCategories
        });
    } catch (error) {
        next(error);
    }
};

export const getCategoryProducts = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const categoryPattern = new RegExp(`^${slug.replace(/-/g, "[ -]?")}$`, "i");

        const products = await Product.find({
            category: categoryPattern,
            isActive: true,
            status: "published"
        })
            .populate("userId", "username")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments({
            category: categoryPattern,
            isActive: true,
            status: "published"
        });

        const categoryName = products[0]?.category || slug.toUpperCase();

        res.status(200).json({
            success: true,
            category: {
                name: categoryName,
                slug: slug,
                productCount: total
            },
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getSellers = async (req, res, next) => {
    try {
        const sellersWithProducts = await Product.aggregate([
            { $match: { isActive: true, status: "published" } },
            {
                $group: {
                    _id: "$userId",
                    productCount: { $sum: 1 }
                }
            }
        ]);

        const sellerIds = sellersWithProducts.map(s => s._id);

        const sellers = await User.find({
            _id: { $in: sellerIds },
            accountStatus: "active"
        }).select("username fullname email createdAt");

        const sellersData = sellers.map(seller => {
            const productData = sellersWithProducts.find(
                s => s._id.toString() === seller._id.toString()
            );
            return {
                username: seller.username,
                fullname: seller.fullname,
                productCount: productData?.productCount || 0,
                joinedAt: seller.createdAt
            };
        });

        res.status(200).json({
            success: true,
            sellers: sellersData
        });
    } catch (error) {
        next(error);
    }
};

export const getSellerProfile = async (req, res, next) => {
    try {
        const { username } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const seller = await User.findOne({
            username: username.toLowerCase(),
            accountStatus: "active"
        }).select("username fullname email phone_no createdAt");

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        const products = await Product.find({
            userId: seller._id,
            isActive: true,
            status: "published"
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments({
            userId: seller._id,
            isActive: true,
            status: "published"
        });

        res.status(200).json({
            success: true,
            seller: {
                username: seller.username,
                fullname: seller.fullname,
                email: seller.email,
                phone: seller.phone_no,
                joinedAt: seller.createdAt,
                productCount: total
            },
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getSitemapIndex = async (req, res, next) => {
    try {
        const baseUrl = "https://lookupss.vercel.app";
        const apiBase = "https://lookupsbackend.vercel.app";

        const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${apiBase}/api/seo/sitemap-products.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${apiBase}/api/seo/sitemap-categories.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${apiBase}/api/seo/sitemap-sellers.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
</sitemapindex>`;

        res.set("Content-Type", "application/xml");
        res.send(sitemapIndex);
    } catch (error) {
        next(error);
    }
};

export const getProductsSitemap = async (req, res, next) => {
    try {
        const baseUrl = "https://lookupss.vercel.app";

        const products = await Product.find({
            isActive: true,
            status: "published"
        })
            .populate("userId", "username")
            .select("slug updatedAt userId")
            .lean();

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        for (const product of products) {
            const sellerUsername = product.userId?.username;
            if (sellerUsername && product.slug) {
                xml += `
    <url>
        <loc>${baseUrl}/${sellerUsername}/${product.slug}</loc>
        <lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
            }
        }

        xml += `
</urlset>`;

        res.set("Content-Type", "application/xml");
        res.send(xml);
    } catch (error) {
        next(error);
    }
};

export const getCategoriesSitemap = async (req, res, next) => {
    try {
        const baseUrl = "https://lookupss.vercel.app";

        const categories = await Product.aggregate([
            { $match: { isActive: true, status: "published" } },
            { $group: { _id: "$category" } }
        ]);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        for (const cat of categories) {
            const slug = cat._id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            xml += `
    <url>
        <loc>${baseUrl}/category/${slug}</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
    </url>`;
        }

        xml += `
</urlset>`;

        res.set("Content-Type", "application/xml");
        res.send(xml);
    } catch (error) {
        next(error);
    }
};

export const getSellersSitemap = async (req, res, next) => {
    try {
        const baseUrl = "https://lookupss.vercel.app";

        const sellersWithProducts = await Product.aggregate([
            { $match: { isActive: true, status: "published" } },
            { $group: { _id: "$userId" } }
        ]);

        const sellerIds = sellersWithProducts.map(s => s._id);

        const sellers = await User.find({
            _id: { $in: sellerIds },
            accountStatus: "active"
        }).select("username updatedAt").lean();

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        for (const seller of sellers) {
            xml += `
    <url>
        <loc>${baseUrl}/store/${seller.username}</loc>
        <lastmod>${new Date(seller.updatedAt || Date.now()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>`;
        }

        xml += `
</urlset>`;

        res.set("Content-Type", "application/xml");
        res.send(xml);
    } catch (error) {
        next(error);
    }
};
