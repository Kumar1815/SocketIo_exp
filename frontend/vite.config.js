import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: [
      '55ec-34-74-228-140.ngrok-free.app', // Add the ngrok domain you are using
      'localhost', // Optional, add localhost if needed
    ],
  },
})
