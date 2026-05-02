import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,           // shows PWA in development
      },
      manifest: {
        id: '/',                    // fixes the "id" warning
        name: 'Pulse',
        short_name: 'Pulse',
        description: 'Real-time Social App - Your Pulse of the world',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'      // required for modern OS
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})









// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// import { VitePWA } from 'vite-plugin-pwa'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//     react(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       devOptions: {
//         enabled: true
//       }
//     })
  
//   ],
// })
