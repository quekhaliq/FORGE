import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base './' keeps asset paths relative so the built app works from any
// GitHub Pages sub-path (e.g. username.github.io/hybrid-prep-hub-my/)
export default defineConfig({
  plugins: [react()],
  base: './',
})
