// frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // THIS IS THE FIX
    // This proxy configures the Vite development server to forward
    // any request to `/api` over to your backend server.
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // Can be set to false if your backend is not using https
      },
    },
  },
});