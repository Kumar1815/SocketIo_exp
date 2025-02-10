import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443, // Ensures compatibility with ngrok
    },
    allowedHosts: "all", // Allow all hosts (for ngrok)
    cors: true, // Enable CORS
  },
});
