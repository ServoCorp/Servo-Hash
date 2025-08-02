import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for deployment flexibility
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
