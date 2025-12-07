import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // base: '/Grocery_project/',  // GitHub repo name
  
  // Build optimizations
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['bootstrap'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable'],
          'animation-vendor': ['motion'],
        },
      },
    },
    // Enable chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
