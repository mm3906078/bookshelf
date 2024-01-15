import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    proxy: {
      "/users": "http://localhost:5000",
      "/books": "http://localhost:5000",
      "/orders": "http://localhost:5000",
      "/comments": "http://localhost:5000",
    },
  },
});
