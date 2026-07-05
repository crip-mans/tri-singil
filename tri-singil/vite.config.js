import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Tri-Singil',
        short_name: 'TriSingil',
        description: 'Fixed-fare tricycle fare estimator for the Philippines',
        theme_color: '#F4511E',
        background_color: '#FFF8E1',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Precache the built JS/CSS/HTML app shell for offline use.
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        runtimeCaching: [
          {
            // Fare data from Supabase: serve cached data instantly while
            // refreshing in the background, so fare lookups still work offline.
            urlPattern: /\/rest\/v1\/(zones|fare_matrix|fare_modifiers)/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'fare-data-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
