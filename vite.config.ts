import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/styles/variables.less";`,
        javascriptEnabled: true,
        math: 'always'
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
