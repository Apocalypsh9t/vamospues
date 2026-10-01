import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { PRECIO_SIN_LIMITE } from '../utils/constantes';

const AppContext = createContext(null);

export const FILTROS_INICIALES = {
  busqueda: '',
  precioMaximo: PRECIO_SIN_LIMITE,
  chipPrecioActivo: PRECIO_SIN_LIMITE,
  categorias: [],
  municipio: 'Todos',
  edad: 'all',
  orden: 'default',
  soloFavoritos: false,
};

const FAVORITOS_KEY = 'vamos_pues_favoritos_v1';

// Los favoritos viven en el navegador de cada persona (no necesitan cuenta)
function leerFavoritos() {
  try {
    const guardados = JSON.parse(localStorage.getItem(FAVORITOS_KEY));
    return Array.isArray(guardados) ? guardados : [];
  } catch {
    return [];
  }
}

/**
 * Estado compartido de toda la app: lugares y categorías traídos del backend, los
 * filtros de Explorar (que también usa el mapa) y la ficha de lugar abierta.
 */
export function AppProvider({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [lugares, setLugares] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargado, setCargado] = useState(false);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [lugarAbiertoId, setLugarAbiertoId] = useState(null);
  const [favoritos, setFavoritos] = useState(leerFavoritos);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
    } catch {
      // Sin almacenamiento (modo incógnito estricto): los favoritos duran solo esta visita
    }
  }, [favoritos]);

  const alternarFavorito = useCallback((id) => {
    setFavoritos((actual) => (actual.includes(id) ? actual.filter((f) => f !== id) : [...actual, id]));
  }, []);

  const recargarDatos = useCallback(async () => {
    try {
      const [resLugares, resCategorias] = await Promise.all([
        api.get('/lugares'),
        api.get('/categorias'),
      ]);
      setLugares(resLugares.data);
      setCategorias(resCategorias.data);
      setCargado(true);
      return true;
    } catch (err) {
      console.error('No se pudo conectar con el backend de Vamos Pues:', err);
      return false;
    }
  }, []);

  // Si el backend todavía está arrancando, reintentar cada 3 segundos hasta que responda
  // (así la página carga sola sin tener que refrescar)
  useEffect(() => {
    let cancelado = false;
    let timer;
    const intentar = async () => {
      const ok = await recargarDatos();
      if (!ok && !cancelado) timer = setTimeout(intentar, 3000);
    };
    intentar();
    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [recargarDatos]);

  const actualizarFiltros = useCallback((cambios) => {
    setFiltros((actual) => ({ ...actual, ...cambios }));
  }, []);

  const restablecerFiltros = useCallback(() => {
    setFiltros({ ...FILTROS_INICIALES, chipPrecioActivo: null });
  }, []);

  // Al cerrar la ficha que se abrió desde un enlace compartido (/lugar/15), volver a Explorar
  const cerrarLugar = useCallback(() => {
    setLugarAbiertoId(null);
    if (pathname.startsWith('/lugar/')) navigate('/explorar', { replace: true });
  }, [pathname, navigate]);

  const verEnMapa = useCallback((lugarId) => {
    setLugarAbiertoId(null);
    navigate('/mapa', { state: { enfocarLugarId: lugarId } });
  }, [navigate]);

  const valor = useMemo(() => ({
    lugares,
    categorias,
    cargado,
    recargarDatos,
    filtros,
    actualizarFiltros,
    restablecerFiltros,
    lugarAbierto: lugares.find((l) => l.id === lugarAbiertoId) || null,
    abrirLugar: setLugarAbiertoId,
    cerrarLugar,
    verEnMapa,
    favoritos,
    esFavorito: (id) => favoritos.includes(id),
    alternarFavorito,
  }), [lugares, categorias, cargado, recargarDatos, filtros, actualizarFiltros, restablecerFiltros, lugarAbiertoId, cerrarLugar, verEnMapa, favoritos, alternarFavorito]);

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
