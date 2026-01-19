import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['vite.svg'],
    //   manifest: {
    //     name: 'DeshRock',
    //     short_name: 'DeshRock',
    //     description: 'DeshRock',
    //     theme_color: '#ffffff',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     scope: '/',
    //     start_url: '/',
    //     orientation: 'portrait',
    //     icons: [
    //       {
    //         src: 'pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   },
    //   devOptions: {
    //     enabled: false
    //   }
    // })
  ],
  server: {
    allowedHosts: ['nonfungible-crinal-veola.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimizeDeps: {
    include: ['recharts', 'react-is']
  }
})
