import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// target: "https://lookupsclient.vercel.app",
// secure: false,
export default defineConfig({
  server: {
    proxy: {
      // "/api": "https://lookupsbackend.vercel.app",
    },
  },
  plugins: [react(), tailwindcss()],
});
