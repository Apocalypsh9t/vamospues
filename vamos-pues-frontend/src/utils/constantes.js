export const MUNICIPIOS = [
  'Medellín', 'Envigado', 'Sabaneta', 'Bello', 'Itagüí',
  'La Estrella', 'Caldas', 'Copacabana', 'Girardota', 'Barbosa',
];

export const PRECIO_SIN_LIMITE = 100000;

export const IMAGEN_RESPALDO = '/assets/img/pattern-bg.jpg';

export const IMAGEN_POR_DEFECTO =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

// Centro de Medellín, usado cuando un lugar no tiene coordenadas
export const COORDENADAS_POR_DEFECTO = { lat: 6.2442, lng: -75.5812 };

// Mapa de OpenStreetMap: gratis y sin API key (CARTO empezó a exigir una)
export const TILES_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export const ZONAS_MAPA = {
  todos: { center: [6.2442, -75.5812], zoom: 12 },
  centro: { center: [6.2518, -75.5670], zoom: 15 },
  poblado: { center: [6.2089, -75.5670], zoom: 14 },
  laureles: { center: [6.2488, -75.5898], zoom: 14 },
  norte: { center: [6.2711, -75.5663], zoom: 14 },
  envigado: { center: [6.1712, -75.5867], zoom: 14 },
  sabaneta: { center: [6.1517, -75.6158], zoom: 14 },
  bello: { center: [6.3331, -75.5583], zoom: 14 },
};

export const formatearCOP = (valor) => Number(valor).toLocaleString('es-CO');

/** Mismo formato que arma el backend: 0 → "Gratis ($0)", 15000 → "$15.000 COP". */
export const formatearPrecio = (valor) =>
  Number(valor) === 0 ? 'Gratis ($0)' : `$${formatearCOP(Number(valor) || 0)} COP`;

/** Fondo de una imagen con el patrón de la marca debajo, por si el enlace de la foto está roto. */
export const fondoConRespaldo = (url) =>
  url ? `url('${url}'), url('${IMAGEN_RESPALDO}')` : `url('${IMAGEN_RESPALDO}')`;

export const esGratis = (lugar) => Number(lugar.precio) === 0;

// Si la imagen de un lugar no carga, se muestra el patrón de la marca
export const usarImagenRespaldo = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = IMAGEN_RESPALDO;
};
