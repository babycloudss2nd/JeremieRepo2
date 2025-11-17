// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    // fallback to index.html for SPA routes
    historyApiFallback: true
  }
})
