import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
// target: "https://lookupsclient.vercel.app",
// secure: false,
export default defineConfig({
  server: {
    proxy: {
      // "/api": {
      //   target: "http://localhost:3000",
      //   changeOrigin: true,
      //   secure: false,
      // },
      // Production proxy (uncomment to use production backend)
      // "/api": "https://lookupsbackend-is4ixi526-deploy-react-apps-projects.vercel.app",
      "/api": "https://lookupsbackend.vercel.app",
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.png", "vite.svg"],
      manifest: {
        name: "Lookups",
        short_name: "Lookups",
        description: "Lookups - Your marketplace platform",
        theme_color: "#059669",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
          },
          // {
          //   src: "/logo.png",
          //   sizes: "512x512",
          //   type: "image/png",
          //   purpose: "maskable",
          // },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/lookupsbackend\.vercel\.app\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA in dev mode for testing
      },
    }),
  ],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         // Split vendor chunks
  //         'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  //         'vendor-icons': ['hugeicons-react'],
  //         'vendor-utils': ['zustand', 'react-helmet-async'],
  //       },
  //     },
  //   },
  //   // Increase warning threshold if you want to suppress warning
  //   chunkSizeWarningLimit: 600,
  // },
});
