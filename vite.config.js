import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import glsl from 'vite-plugin-glsl'



export default defineConfig({
  plugins: [react(), tailwindcss(), glsl()],
  server: {
    port: 3000,
    open: true
  }
}) 