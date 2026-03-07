import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

// https://vite.js.org/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    https: {
      key: readFileSync('./key.pem'),
      cert: readFileSync('./cert.pem'),
    }
  }
})
