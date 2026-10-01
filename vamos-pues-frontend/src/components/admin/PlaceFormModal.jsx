import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useApp } from '../../context/AppContext';
import { COORDENADAS_POR_DEFECTO, IMAGEN_POR_DEFECTO, MUNICIPIOS, TILES_URL, formatearPrecio } from '../../utils/constantes';
import '../../utils/mapa';

const formularioDesde = (datos) => {
  const precio = datos?.precio ?? 0;
  return {
    nombre: datos?.nombre ?? '',
    categoria: datos?.categoria ?? 'Gastronomía',
    municipio: datos?.municipio ?? 'Medellín',
    direccion: datos?.direccion ?? '',
    precio,
    precioFormateado: datos?.precioFormateado || formatearPrecio(precio),
    horario: datos?.horario ?? '',
    descripcion: datos?.descripcion ?? '',
    comoLlegar: datos?.comoLlegar ?? '',
    sitioWeb: datos?.sitioWeb ?? '',
    instagram: datos?.instagram ?? '',
    imagen: datos?.imagen ?? '',
    mayorDeEdad: Boolean(datos?.mayorDeEdad),
    esEvento: Boolean(datos?.esEvento),
    latitud: datos?.latitud ?? COORDENADAS_POR_DEFECTO.lat,
    longitud: datos?.longitud ?? COORDENADAS_POR_DEFECTO.lng,
  };
};

/**
 * Formulario admin de un lugar. Se usa para crear, editar y para revisar una sugerencia
 * antes de publicarla: quien lo abre decide qué hacer con los datos en alGuardar.
 */
export default function PlaceFormModal({ abierto, titulo, valoresIniciales, textoGuardar, alGuardar, cerrar }) {
  const { categorias } = useApp();
  const [form, setForm] = useState(formularioDesde(valoresIniciales));
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (abierto) setForm(formularioDesde(valoresIniciales));
  }, [abierto, valoresIniciales]);

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => {
      const nuevo = { ...f, [name]: type === 'checkbox' ? checked : value };
      // Si el texto del precio era el automático, se actualiza solo al cambiar el precio;
      // si el admin escribió uno propio (ej. "Entre $15.000 y $25.000 COP") se respeta.
      if (name === 'precio' && (!f.precioFormateado || f.precioFormateado === formatearPrecio(f.precio))) {
        nuevo.precioFormateado = formatearPrecio(value);
      }
      return nuevo;
    });
  };

  const moverPin = (lat, lng) => setForm((f) => ({ ...f, latitud: Number(lat.toFixed(6)), longitud: Number(lng.toFixed(6)) }));

  const guardar = async (e) => {
    e.preventDefault();
    const nombre = form.nombre.trim();
    if (!nombre) {
      alert('Por favor introduce el nombre del lugar.');
      return;
    }
    setGuardando(true);
    try {
      await alGuardar({
        ...form,
        nombre,
        precio: parseInt(form.precio, 10) || 0,
        precioFormateado: form.precioFormateado.trim(),
        imagen: form.imagen.trim() || IMAGEN_POR_DEFECTO,
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className={`modal ${abierto ? 'is-open' : ''}`} id="admin-place-modal" role="dialog" aria-modal="true">
      <div className="modal-dialog" style={{ maxWidth: '820px' }}>
        <button className="modal-close-corner" onClick={cerrar} aria-label="Cerrar">✕</button>
        <div style={{ padding: '2rem' }}>
          <h2 id="admin-place-modal-title" className="mb-3">{titulo}</h2>

          <form id="admin-place-form" onSubmit={guardar}>
            <div className="mb-3">
              <label className="filter-label">Nombre del lugar o evento *</label>
              <input type="text" name="nombre" value={form.nombre} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} required />
            </div>

            <div className="d-flex gap-2 wrap mb-3">
              <div style={{ flex: 1, minWidth: '220px' }}>
                <label className="filter-label">Categoría *</label>
                <select name="categoria" value={form.categoria} onChange={cambiar} className="select-custom w-100" style={{ width: '100%' }}>
                  {categorias.map((c) => <option key={c.id} value={c.nombre}>{c.icono} {c.nombre}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <label className="filter-label">Municipio *</label>
                <select name="municipio" value={form.municipio} onChange={cambiar} className="select-custom w-100" style={{ width: '100%' }}>
                  {!MUNICIPIOS.includes(form.municipio) && <option value={form.municipio}>{form.municipio}</option>}
                  {MUNICIPIOS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="d-flex gap-2 wrap mb-3">
              <div style={{ flex: 2, minWidth: '220px' }}>
                <label className="filter-label">Dirección exacta</label>
                <input type="text" name="direccion" value={form.direccion} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} required />
              </div>
              <div style={{ flex: 1, minWidth: '160px' }}>
                <label className="filter-label">Precio en COP (0 para gratis)</label>
                <input type="number" name="precio" value={form.precio} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} min="0" required />
              </div>
            </div>

            <div className="mb-3">
              <label className="filter-label">Texto del precio que verá la gente</label>
              <input type="text" name="precioFormateado" value={form.precioFormateado} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} placeholder="Ej: Entre $15.000 y $25.000 COP" />
              <small className="text-xs text-muted">El número de arriba se usa para los filtros y el generador; este texto es el que aparece en las tarjetas.</small>
            </div>

            <div className="mb-3">
              <label className="filter-label">Horario</label>
              <input type="text" name="horario" value={form.horario} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} placeholder="Ej: Lunes a domingo 9:00 am a 6:00 pm" />
            </div>

            <div className="mb-3">
              <label className="filter-label">Descripción</label>
              <textarea name="descripcion" value={form.descripcion} onChange={cambiar} className="input-custom w-100" style={{ width: '100%', minHeight: '80px' }} required></textarea>
            </div>

            <div className="mb-3">
              <label className="filter-label">¿Cómo llegar en transporte público?</label>
              <input type="text" name="comoLlegar" value={form.comoLlegar} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} />
            </div>

            <div className="d-flex gap-2 wrap mb-3">
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label className="filter-label">Sitio Web</label>
                <input type="text" name="sitioWeb" value={form.sitioWeb} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label className="filter-label">Instagram (@usuario)</label>
                <input type="text" name="instagram" value={form.instagram} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="mb-3">
              <label className="filter-label">URL de Imagen</label>
              <input type="url" name="imagen" value={form.imagen} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} placeholder="https://images.unsplash.com/..." />
            </div>

            {/* MINI MAPA PARA SELECCIONAR COORDENADAS REALES */}
            <div className="mb-3">
              <label className="filter-label">Ubicación geográfica en el mapa (Arrastra el marcador o haz clic)</label>
              {abierto ? (
                <MapContainer
                  key={`${titulo}-${valoresIniciales?.id ?? 'nuevo'}`}
                  id="admin-mini-map"
                  className="mini-map-picker"
                  center={[form.latitud, form.longitud]}
                  zoom={14}
                >
                  <TileLayer url={TILES_URL} maxZoom={19} />
                  <SelectorUbicacion lat={form.latitud} lng={form.longitud} alMover={moverPin} />
                </MapContainer>
              ) : (
                <div id="admin-mini-map" className="mini-map-picker"></div>
              )}
              <div className="d-flex gap-2 mt-2">
                <input type="text" className="input-custom" style={{ flex: 1 }} readOnly title="Latitud" value={form.latitud} />
                <input type="text" className="input-custom" style={{ flex: 1 }} readOnly title="Longitud" value={form.longitud} />
              </div>
            </div>

            <div className="d-flex gap-3 wrap mb-4">
              <label className="generator-checkbox-wrap" style={{ flex: 1 }}>
                <input type="checkbox" name="mayorDeEdad" checked={form.mayorDeEdad} onChange={cambiar} />
                <span>🔞 Exclusivo +18</span>
              </label>
              <label className="generator-checkbox-wrap" style={{ flex: 1 }}>
                <input type="checkbox" name="esEvento" checked={form.esEvento} onChange={cambiar} />
                <span>🎪 Es un evento temporal</span>
              </label>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={guardando}>
                {guardando ? 'GUARDANDO...' : textoGuardar}
              </button>
              <button type="button" className="btn btn-outline" onClick={cerrar}>
                CANCELAR
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Pin arrastrable; también se mueve al hacer clic en cualquier parte del mapa
function SelectorUbicacion({ lat, lng, alMover }) {
  const map = useMap();
  useMapEvents({ click: (e) => alMover(e.latlng.lat, e.latlng.lng) });

  // El modal aparece con una animación: recalcular el tamaño cuando termina
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(timer);
  }, [map]);

  return (
    <Marker
      position={[lat, lng]}
      draggable
      eventHandlers={{ dragend: (e) => { const p = e.target.getLatLng(); alMover(p.lat, p.lng); } }}
    />
  );
}
