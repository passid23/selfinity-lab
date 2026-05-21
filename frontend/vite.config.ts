import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // This forces Vite to resolve these libraries to your root node_modules
    dedupe: ['react', 'react-dom', 'recharts']
  }
})
