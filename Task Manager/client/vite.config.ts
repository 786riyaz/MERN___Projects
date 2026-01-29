import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // 👈 allows external access
    // port: 5173,
    // strictPort: true,
    // allowedHosts: 'all', // 👈 allow devtunnels domain
  },
})
