import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/conjugate': {
        target: 'http://127.0.0.1:8000/conjugate/',
        // target: 'https://api.verbolo.co/conjugate/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/conjugate/, '')
      }
    }
  }
})
