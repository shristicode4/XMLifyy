import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Optional: Prevent splitting chunks
      },
    },
  },
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf.worker.min.js"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // ✅ Required for Render to bind correctly
    port: process.env.PORT || 10000, // ✅ Use Render-assigned PORT
    proxy: {
      "/api": {
        target: "https://xmlifyy.onrender.com",
        changeOrigin: true,
        secure: true, // If backend is on HTTPS
      },
    },
  },
});
