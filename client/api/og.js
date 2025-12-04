export const config = {
    runtime: 'edge',
};

// Bot user agents to detect
const BOT_AGENTS = [
    'whatsapp',
    'facebookexternalhit',
    'facebot',
    'twitterbot',
    'linkedinbot',
    'pinterest',
    'slackbot',
    'telegrambot',
    'googlebot',
    'bingbot',
    'applebot',
];

// Site configuration
const SITE_URL = 'https://auth-fawn-eight.vercel.app';
const BACKEND_URL = 'https://lookupsbackend.vercel.app';
const SITE_NAME = 'Lookups';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
// const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

// Static page metadata with ~35 word descriptions
const PAGE_META = {
    '/': {
        title: 'Lookups - Your Marketplace Platform',
        description: 'Discover amazing products and connect with trusted sellers on Lookups. Your premier marketplace platform for buying and selling quality goods. Join thousands of satisfied users and start your shopping journey today with confidence and ease.',
    },
    '/login': {
        title: 'Login - Lookups',
        description: 'Sign in to your Lookups account to access your personalized dashboard, manage your products, track your orders, and connect with buyers. Secure login with password protection ensures your account stays safe and private.',
    },
    '/register': {
        title: 'Create Account - Lookups',
        description: 'Join Lookups today and become part of our growing marketplace community. Create your free account in seconds to start selling your products or discover amazing deals from verified sellers across multiple categories.',
    },
    '/forgot-password': {
        title: 'Reset Password - Lookups',
        description: 'Forgot your Lookups password? No worries! Reset it securely in just a few simple steps. We will send you a verification code to your registered email address to help you regain access quickly.',
    },
};

function isBot(userAgent) {
    if (!userAgent) return false;
    const ua = userAgent.toLowerCase();
    return BOT_AGENTS.some((bot) => ua.includes(bot));
}

function generateHTML(meta) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="${meta.type || 'website'}">
  <meta property="og:url" content="${meta.url}">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:image" content="${meta.image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="${SITE_NAME}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${meta.image}">
</head>
<body>
  <h1>${meta.title}</h1>
  <p>${meta.description}</p>
</body>
</html>`;
}

// Fetch product data for dynamic product pages
async function getProductMeta(productId) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/products/${productId}`);
        if (!res.ok) return null;
        const product = await res.json();

        const description = product.description
            ? product.description.substring(0, 200)
            : `Buy ${product.name} at the best price on Lookups. Quality products from verified sellers. Shop with confidence and enjoy secure transactions on our trusted marketplace platform today.`;

        return {
            title: `${product.name} | Lookups`,
            description: description,
            image: product.images?.[0] || DEFAULT_IMAGE,
            type: 'product',
        };
    } catch (err) {
        return null;
    }
}

// Fetch seller data for dynamic seller pages
async function getSellerMeta(sellerId) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/seller/${sellerId}`);
        if (!res.ok) return null;
        const seller = await res.json();

        const name = seller.fullName || seller.username || 'Seller';
        const description = seller.bio
            ? seller.bio.substring(0, 200)
            : `Shop quality products from ${name} on Lookups. Trusted seller with verified products available for purchase. Browse their collection and find amazing deals on our secure marketplace platform today.`;

        return {
            title: `${name} | Lookups Seller`,
            description: description,
            image: DEFAULT_IMAGE,
            type: 'profile',
        };
    } catch (err) {
        return null;
    }
}

export default async function handler(request) {
    const userAgent = request.headers.get('user-agent') || '';
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Only intercept for bots
    if (!isBot(userAgent)) {
        return new Response(null, {
            status: 200,
            headers: { 'x-middleware-next': 'true' },
        });
    }

    let meta = null;

    // Handle dynamic product pages: /product/:id
    const productMatch = pathname.match(/^\/product\/([a-zA-Z0-9]+)$/);
    if (productMatch) {
        const productId = productMatch[1];
        const productMeta = await getProductMeta(productId);
        if (productMeta) {
            meta = {
                ...productMeta,
                url: `${SITE_URL}${pathname}`,
            };
        }
    }

    // Handle dynamic seller pages: /seller/:id
    const sellerMatch = pathname.match(/^\/seller\/([a-zA-Z0-9]+)$/);
    if (sellerMatch) {
        const sellerId = sellerMatch[1];
        const sellerMeta = await getSellerMeta(sellerId);
        if (sellerMeta) {
            meta = {
                ...sellerMeta,
                url: `${SITE_URL}${pathname}`,
            };
        }
    }

    // Fallback to static page meta
    if (!meta) {
        const pageMeta = PAGE_META[pathname] || PAGE_META['/'];
        meta = {
            title: pageMeta.title,
            description: pageMeta.description,
            url: `${SITE_URL}${pathname}`,
            image: DEFAULT_IMAGE,
            type: 'website',
        };
    }

    const html = generateHTML(meta);

    return new Response(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
