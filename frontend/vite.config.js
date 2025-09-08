import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defaultEndPoint } from './src/utilities/endPoints.js'
export const endPointLiteral = '/api'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
     '/api' : {
        target: defaultEndPoint,
      },
    },
  },
})
