import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useApp } from '../context/AppContext';
import { filtrarLugares } from '../utils/filtros';
import { TILES_URL, ZONAS_MAPA, fondoConRespaldo, usarImagenRespaldo } from '../utils/constantes';
import { calcularDistanciaKm, crearIconoGrupo, crearIconoLugar, iconoUsuario, textoDistancia } from '../utils/mapa';

const BOTONES_ZONA = [
  ['todos', 'Todo el Valle'], ['centro', 'Centro'], ['poblado', 'El Poblado'], ['laureles', 'Laureles'],
  ['norte', 'Norte / Explora'], ['envigado', 'Envigado'], ['sabaneta', 'Sabaneta'], ['bello', 'Bello'],
];

const CANTIDAD_CERCANOS = 5;

export default function Mapa() {
  const location = useLocation();
  const { lugares, categorias, filtros, favoritos, abrirLugar } = useApp();
  const [mapa, setMapa] = useState(null);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const marcadoresRef = useRef({});
  const grupoRef = useRef(null);

  // El mapa muestra los mismos lugares que la sección Explorar con sus filtros actuales
  const lugaresVisibles = filtrarLugares(lugares, filtros, favoritos)
    .filter((l) => typeof l.latitud === 'number' && typeof l.longitud === 'number');

  const cercanos = ubicacionUsuario
    ? lugaresVisibles
      .map((l) => ({ lugar: l, km: calcularDistanciaKm(ubicacionUsuario.lat, ubicacionUsuario.lng, l.latitud, l.longitud) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, CANTIDAD_CERCANOS)
    : [];

  // Centra el mapa en un lugar y abre su popup. Si el pin está dentro de un grupo (círculo
  // con número), primero se hace zoom hasta que el pin quede visible.
  const enfocarLugar = useCallback((lugar) => {
    if (!mapa) return;
    mapa.setView([lugar.latitud, lugar.longitud], 16, { animate: true });
    setTimeout(() => {
      const marcador = marcadoresRef.current[lugar.id];
      if (!marcador) return;
      if (grupoRef.current) grupoRef.current.zoomToShowLayer(marcador, () => marcador.openPopup());
      else marcador.openPopup();
    }, 350);
  }, [mapa]);

  // "Ver en el mapa" desde la ficha de un lugar o el generador
  const enfocarLugarId = location.state?.enfocarLugarId;
  useEffect(() => {
    if (!mapa || !enfocarLugarId) return undefined;
    const lugar = lugares.find((l) => l.id === enfocarLugarId);
    if (!lugar) return undefined;
    const timer = setTimeout(() => enfocarLugar(lugar), 350);
    return () => clearTimeout(timer);
  }, [mapa, enfocarLugarId, lugares, enfocarLugar]);

  const irAZona = (zona) => {
    const destino = ZONAS_MAPA[zona] || ZONAS_MAPA.todos;
    mapa?.flyTo(destino.center, destino.zoom, { duration: 1.2 });
  };

  const ubicarUsuario = () => {
    // Los navegadores solo entregan la ubicación en páginas seguras (https o este mismo PC)
    if (!navigator.geolocation || !window.isSecureContext) {
      alert(window.isSecureContext
        ? 'Tu navegador no soporta geolocalización.'
        : '📍 Tu navegador solo comparte la ubicación en páginas seguras (https). Desde este enlace no es posible: usa los botones de ZONAS RÁPIDAS para moverte por el mapa.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUbicacionUsuario(coords);
        mapa?.flyTo([coords.lat, coords.lng], 14, { duration: 1.5 });
        alert('¡Ubicación detectada! Hemos centrado el mapa y calculado la distancia a los lugares cercanos.');
      },
      (error) => {
        alert(error.code === error.PERMISSION_DENIED
          ? 'Permiso de ubicación denegado por el navegador.'
          : 'No se pudo obtener tu ubicación.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <section id="section-mapa" className="map-section">
      <div className="container">

        <div className="section-header">
          <div>
            <h1 className="section-title">🗺️ MAPA INTERACTIVO DEL VALLE</h1>
            <p className="section-subtitle">Explora los parches geolocalizados por todo el Valle de Aburrá. Haz clic en un marcador para conocer los detalles.</p>
          </div>
        </div>

        {/* CONTROLES DEL MAPA */}
        <div className="map-controls-bar">
          <div className="d-flex align-center gap-2 wrap">
            <span className="font-bold text-xs">ZONAS RÁPIDAS:</span>
            {BOTONES_ZONA.map(([zona, texto]) => (
              <button key={zona} className="btn btn-outline btn-sm" onClick={() => irAZona(zona)}>{texto}</button>
            ))}
          </div>

          {/* BOTÓN LUGARES CERCA DE MÍ */}
          <button className="btn btn-accent btn-sm" onClick={ubicarUsuario}>
            📍 LUGARES CERCA DE MÍ
          </button>
        </div>

        {/* CONTENEDOR DEL MAPA REAL LEAFLET */}
        <div className="map-wrapper">
          <MapContainer id="map-container" center={ZONAS_MAPA.todos.center} zoom={ZONAS_MAPA.todos.zoom} scrollWheelZoom zoomControl ref={setMapa}>
            <TileLayer
              url={TILES_URL}
              subdomains="abc"
              maxZoom={19}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Los pines cercanos entre sí se agrupan en un círculo con el número de lugares */}
            <MarkerClusterGroup
              ref={grupoRef}
              chunkedLoading
              maxClusterRadius={45}
              showCoverageOnHover={false}
              spiderfyOnMaxZoom
              iconCreateFunction={crearIconoGrupo}
            >
              {lugaresVisibles.map((lugar) => (
                <Marker
                  key={lugar.id}
                  position={[lugar.latitud, lugar.longitud]}
                  icon={crearIconoLugar(lugar, categorias)}
                  ref={(m) => { if (m) marcadoresRef.current[lugar.id] = m; }}
                >
                  <Popup maxWidth={290} className="brutalist-leaflet-popup">
                    <div className="map-popup-card">
                      <div className="popup-img-wrap" style={{ backgroundImage: fondoConRespaldo(lugar.imagen) }}>
                        {lugar.mayorDeEdad && <span className="badge-tag adult-tag">🔞 +18</span>}
                        <span className="badge-tag price-tag">{Number(lugar.precio) === 0 ? 'GRATIS' : lugar.precioFormateado}</span>
                      </div>
                      <div className="popup-body">
                        <span className="popup-category">{lugar.categoria} · {lugar.municipio}</span>
                        <h4 className="popup-title">{lugar.nombre}</h4>
                        <p className="popup-address">{lugar.direccion}</p>
                        {ubicacionUsuario && (
                          <div className="popup-distance">
                            📍 A {textoDistancia(calcularDistanciaKm(ubicacionUsuario.lat, ubicacionUsuario.lng, lugar.latitud, lugar.longitud))} de ti
                          </div>
                        )}
                        <button className="btn btn-pop-action" onClick={() => abrirLugar(lugar.id)}>
                          VER PLAN COMPLETO ➔
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>

            {ubicacionUsuario && (
              <Marker
                position={[ubicacionUsuario.lat, ubicacionUsuario.lng]}
                icon={iconoUsuario}
                eventHandlers={{ add: (e) => e.target.openPopup() }}
              >
                <Popup><b>¡Aquí estás tú!</b><br />Buscando parches cercanos...</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* LOS PARCHES MÁS CERCANOS A LA UBICACIÓN DEL USUARIO */}
        {cercanos.length > 0 && (
          <div className="mt-5">
            <div className="section-header">
              <div>
                <h2 className="section-title">📍 Parches más cerca de ti</h2>
                <p className="section-subtitle">Los {cercanos.length} lugares más cercanos a tu ubicación según los filtros de Explorar.</p>
              </div>
            </div>
            <div className="alternatives-grid">
              {cercanos.map(({ lugar, km }) => (
                <div key={lugar.id} className="alternative-card">
                  <img src={lugar.imagen} alt={lugar.nombre} className="alt-img" onError={usarImagenRespaldo} />
                  <div className="alt-info">
                    <span className="badge-tag">{lugar.categoria}</span>
                    <h4 className="font-bold">{lugar.nombre}</h4>
                    <div className="alt-price">📍 A {textoDistancia(km)} · {Number(lugar.precio) === 0 ? 'GRATIS' : lugar.precioFormateado}</div>
                    <p className="text-xs text-muted">{lugar.municipio} · {lugar.direccion}</p>
                    <div className="d-flex gap-2 wrap mt-2">
                      <button className="btn btn-sm btn-outline" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); enfocarLugar(lugar); }}>
                        🗺️ UBICAR
                      </button>
                      <button className="btn btn-sm btn-outline" onClick={() => abrirLugar(lugar.id)}>
                        VER PLAN ➔
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
