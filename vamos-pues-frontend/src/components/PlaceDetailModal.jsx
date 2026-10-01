import { useApp } from '../context/AppContext';
import { esGratis, fondoConRespaldo } from '../utils/constantes';

/** Ficha detallada de un lugar (modal). */
export default function PlaceDetailModal() {
  const { lugarAbierto: lugar, cerrarLugar, verEnMapa, esFavorito, alternarFavorito } = useApp();

  return (
    <div className={`modal ${lugar ? 'is-open' : ''}`} id="place-detail-modal" role="dialog" aria-modal="true">
      <div className="modal-dialog">
        <button className="modal-close-corner" onClick={cerrarLugar} aria-label="Cerrar">✕</button>
        <div id="place-detail-content">
          {lugar && (
            <ContenidoLugar
              lugar={lugar}
              cerrarLugar={cerrarLugar}
              verEnMapa={verEnMapa}
              favorito={esFavorito(lugar.id)}
              alternarFavorito={() => alternarFavorito(lugar.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Comparte el enlace directo a la ficha (/lugar/15). En celulares abre el menú de compartir
// (WhatsApp, etc.); si el navegador no lo permite, se muestra el enlace para copiarlo.
async function compartirLugar(lugar) {
  const url = `${window.location.origin}/lugar/${lugar.id}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: `${lugar.nombre} · Vamos Pues`, text: `¡Mira este parche! ${lugar.nombre}`, url });
      return;
    } catch (err) {
      if (err?.name === 'AbortError') return; // la persona cerró el menú de compartir
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    alert('🔗 ¡Enlace copiado! Pégalo donde quieras para compartir este parche.');
  } catch {
    window.prompt('Copia este enlace para compartir el parche:', url);
  }
}

function ContenidoLugar({ lugar, cerrarLugar, verEnMapa, favorito, alternarFavorito }) {
  const gratis = esGratis(lugar);

  return (
    <>
      <div className="modal-place-hero" style={{ backgroundImage: fondoConRespaldo(lugar.imagen) }}>
        <div className="hero-overlay-tags">
          <span className={`badge-tag ${gratis ? 'is-free' : ''}`}>{gratis ? 'PLAN GRATUITO' : lugar.precioFormateado}</span>
          {lugar.mayorDeEdad
            ? <span className="badge-tag adult-badge">🔞 EXCLUSIVO +18</span>
            : <span className="badge-tag" style={{ background: '#DFF800', color: '#0D0127' }}>⭐ PLAN FAMILIAR / JUVENIL</span>}
          {lugar.esEvento && <span className="badge-tag event-badge">🎪 EVENTO ESPECIAL</span>}
        </div>
      </div>
      <div className="modal-place-body">
        <div className="d-flex justify-between align-center wrap gap-2 mb-2">
          <span className="badge-tag" style={{ background: '#FE8616', color: '#0D0127' }}>{lugar.categoria}</span>
          <span className="font-bold text-muted">📍 {lugar.municipio} ({lugar.zona || 'Valle de Aburrá'})</span>
        </div>
        <h2 className="modal-place-title">{lugar.nombre}</h2>

        <p className="modal-place-desc mt-3">{lugar.descripcion}</p>

        <div className="modal-info-grid mt-4">
          <div className="info-block">
            <span className="info-label">💰 Precio / Presupuesto</span>
            <span className="info-value font-bold">{lugar.precioFormateado}</span>
          </div>
          <div className="info-block">
            <span className="info-label">📍 Dirección exacta</span>
            <span className="info-value">{lugar.direccion}</span>
          </div>
          <div className="info-block">
            <span className="info-label">🕐 Horarios habituales</span>
            <span className="info-value">{lugar.horario}</span>
          </div>
          <div className="info-block">
            <span className="info-label">🚇 ¿Cómo llegar en transporte público?</span>
            <span className="info-value">{lugar.comoLlegar}</span>
          </div>
        </div>

        {(lugar.sitioWeb || lugar.instagram) && (
          <div className="modal-links-bar mt-4">
            <span className="font-bold">Enlaces y redes oficiales:</span>
            <div className="d-flex gap-2 wrap mt-2">
              {lugar.sitioWeb && (
                <a href={lugar.sitioWeb} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">🌐 Sitio Web Oficial ↗</a>
              )}
              {lugar.instagram && (
                <a href={`https://instagram.com/${lugar.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  📸 Instagram ({lugar.instagram}) ↗
                </a>
              )}
            </div>
          </div>
        )}

        <div className="modal-actions-bar mt-5 d-flex gap-3 wrap">
          <button className="btn btn-primary" onClick={() => verEnMapa(lugar.id)}>
            🗺️ VER EN EL MAPA INTERACTIVO
          </button>
          <button className={`btn btn-outline ${favorito ? 'is-fav-active' : ''}`} onClick={alternarFavorito}>
            {favorito ? '❤️ EN MIS FAVORITOS' : '🤍 GUARDAR EN FAVORITOS'}
          </button>
          <button className="btn btn-outline" onClick={() => compartirLugar(lugar)}>
            📤 COMPARTIR
          </button>
          <button className="btn btn-secondary" onClick={cerrarLugar}>
            VOLVER A EXPLORAR
          </button>
        </div>
      </div>
    </>
  );
}
