import axios from 'axios';

// Ruta relativa: Vite reenvía /api al backend (ver vite.config.js), así funciona igual desde
// este computador o desde otro equipo de la red. Para otro backend definir VITE_API_URL.
const baseURL = import.meta.env.VITE_API_URL || '/api';

export const ADMIN_TOKEN_KEY = 'vamos_pues_admin_token';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// La sesión del panel admin dura lo mismo que la pestaña del navegador (sessionStorage)
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// El backend responde los errores como { codigoEstado, mensaje, marcaDeTiempo }
export function getErrorMessage(error, fallback) {
  return error?.response?.data?.mensaje || fallback;
}

export function esSesionExpirada(error) {
  return error?.response?.status === 401 || error?.response?.status === 403;
}

export default api;
