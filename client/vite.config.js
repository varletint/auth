import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// target: "https://lookupsclient.vercel.app",
// secure: false,
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      // Production proxy (uncomment to use production backend)
      // "/api": "https://lookupsbackend.vercel.app",
    },
  },
  plugins: [react(), tailwindcss()],
});
