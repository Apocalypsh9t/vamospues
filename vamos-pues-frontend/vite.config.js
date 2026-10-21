import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Escuchar en toda la red local para que otros equipos del mismo WiFi puedan entrar
    host: true,
    port: 5173,
    // Permitir el acceso por un túnel temporal (cloudflared) para compartir la app con un link
    allowedHosts: ['.trycloudflare.com'],
    // Las llamadas a /api se reenvían al backend de este mismo computador. Así los demás
    // equipos solo necesitan acceso al puerto 5173 y no hay problemas de CORS.
    // (BACKEND_URL permite apuntar a otro backend, por ejemplo uno de pruebas)
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:8086',
        // El navegador manda el encabezado Origin con la dirección por la que entró (IP de la red
        // o link del túnel) y el backend rechaza los orígenes que no conoce (403). Como la
        // petición pasa por este mismo servidor, se quita para que el backend la trate como local.
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
        },
      },
    },
  },
})
