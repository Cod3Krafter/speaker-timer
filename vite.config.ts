import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  
  // Tauri expects a relative base path
  base: './',
  
  // Prevent vite from obscuring rust errors
  clearScreen: false,
  
  // Tauri uses localhost as the dev server
  server: {
    port: 5173,
    strictPort: true,
    host: 'localhost',
  },
  
  // Environment variables prefix for Tauri
  envPrefix: ['VITE_', 'TAURI_'],
  
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    // Don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // Produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})