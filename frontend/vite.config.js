import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443, // Ensures compatibility with ngrok
    },
    allowedHosts: "all", // Allows all hosts (for ngrok)
  },
});
