import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      "/users": "http://backend:5000",
      "/books": "http://backend:5000",
      "/orders": "http://backend:5000",
      "/comments": "http://backend:5000",
    },
  },
});
