import { defineConfig } from 'vite'
import svgr from "vite-plugin-svgr";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://livetiming.formula1.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
