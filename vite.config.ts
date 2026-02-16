import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk warning threshold (main bundle includes large images)
    chunkSizeWarningLimit: 1000,
    // Optimize chunking for better code-splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split react and react-dom into separate chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split utilities
          'markdown': ['react-markdown', 'remark-gfm', 'rehype-raw', 'rehype-sanitize'],
        },
      },
    },
  },
})
