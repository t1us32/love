import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync } from 'fs'

const httpsConfig = existsSync('./key.pem') && existsSync('./cert.pem')
  ? {
    key: readFileSync('./key.pem'),
    cert: readFileSync('./cert.pem'),
  }
  : false

// https://vite.js.org/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    https: httpsConfig
  }
})
