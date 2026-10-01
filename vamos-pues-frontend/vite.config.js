import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Escuchar en toda la red local para que otros equipos del mismo WiFi puedan entrar
    host: true,
    port: 5173,
    // Las llamadas a /api se reenvían al backend de este mismo computador. Así los demás
    // equipos solo necesitan acceso al puerto 5173 y no hay problemas de CORS.
    // (BACKEND_URL permite apuntar a otro backend, por ejemplo uno de pruebas)
    proxy: {
      '/api': process.env.BACKEND_URL || 'http://localhost:8086',
    },
  },
})
