import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      port: 5173,
      "/api": {
        target: "http://localhost:51",
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
