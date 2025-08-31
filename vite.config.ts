import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  // Dev server config
  server: {
    proxy: {
      // All calls starting with /api will be proxied to your backend, avoiding browser CORS preflight issues in dev
      '/api': {
        // target: 'http://payooapi.test', // backend origin (without trailing /api)
        target: 'https://payoo.netgen.id', // backend origin (without trailing /api)
        changeOrigin: true,
        secure: false,
        // Optionally rewrite if your axios baseURL still includes /api
        // rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
