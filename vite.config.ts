import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Servo-Hash/', // GitHub Pages base path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
