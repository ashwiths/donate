import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: 'https://savee.space',
      readable: true,
      changefreq: 'daily',
      priority: 0.8,
      generateRobotsTxt: true,
      dynamicRoutes: [
        '/home',
        '/main',
        '/thank-you',
        '/healing-stories',
        '/terms',
        '/account',
        '/inspirations',
        '/breathe-bloom',
        '/sound-wave-serenade',
        '/bio-path-tracer',
        '/therapeutic-path-matrix',
        '/flex-path',
        '/luxe-xo',
        '/mind-flip',
        '/pulse-reflex',
        '/mind-slide',
        '/direct-payment',
      ],
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})

