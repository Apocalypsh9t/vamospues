import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Con Vite, Leaflet no encuentra solo las imágenes de su marcador por defecto
// (el que se usa en el mini-mapa del panel admin), así que se le indican aquí.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

/** Pin neo-brutalista con el emoji y el color de la categoría (rosa si es +18). */
export function crearIconoLugar(lugar, categorias) {
  const cat = (lugar.categoria || 'Cultura').toLowerCase();
  const categoria = categorias.find((c) => c.nombre.toLowerCase() === cat);
  const emoji = categoria ? categoria.icono : '📍';
  const fondo = lugar.mayorDeEdad ? '#FA05B8' : (categoria ? categoria.color : '#DFF800');

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="custom-map-pin ${lugar.mayorDeEdad ? 'is-adult-pin' : ''}" style="background-color: ${fondo};">
        <span class="pin-emoji">${emoji}</span>
        ${lugar.mayorDeEdad ? '<span class="pin-adult-badge">+18</span>' : ''}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
}

/** Círculo con la cantidad de lugares agrupados, con el mismo estilo neo-brutalista de los pines. */
export function crearIconoGrupo(grupo) {
  const cantidad = grupo.getChildCount();
  const tamano = cantidad >= 20 ? 54 : cantidad >= 10 ? 48 : 42;
  return L.divIcon({
    className: 'vp-cluster-marker',
    html: `<div class="vp-cluster" style="width:${tamano}px;height:${tamano}px;">${cantidad}</div>`,
    iconSize: [tamano, tamano],
  });
}

/** 0.35 → "350 metros", 2.47 → "2.5 km" */
export const textoDistancia = (km) => (km < 1 ? `${Math.round(km * 1000)} metros` : `${km.toFixed(1)} km`);

export const iconoUsuario = L.divIcon({
  className: 'user-location-marker',
  html: '<div class="user-pulse-dot"><span class="user-center-dot"></span></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

/** Fórmula de Haversine: distancia en km entre dos coordenadas. */
export function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
