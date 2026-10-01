import { useApp } from '../context/AppContext';
import { esGratis, fondoConRespaldo } from '../utils/constantes';

export default function PlaceCard({ lugar }) {
  const { abrirLugar, esFavorito, alternarFavorito } = useApp();
  const gratis = esGratis(lugar);
  const favorito = esFavorito(lugar.id);

  return (
    <article className="place-card">
      <div className="card-media" style={{ backgroundImage: fondoConRespaldo(lugar.imagen) }}>
        <div className="card-badges-top">
          <span className={`badge-tag price-badge ${gratis ? 'is-free' : ''}`}>{gratis ? 'GRATIS' : lugar.precioFormateado}</span>
          {lugar.mayorDeEdad && <span className="badge-tag adult-badge">🔞 +18</span>}
          {lugar.esEvento && <span className="badge-tag event-badge">🎪 EVENTO</span>}
        </div>
        <button
          type="button"
          className={`fav-btn ${favorito ? 'is-fav' : ''}`}
          onClick={() => alternarFavorito(lugar.id)}
          title={favorito ? 'Quitar de mis favoritos' : 'Guardar en mis favoritos'}
          aria-label={favorito ? 'Quitar de mis favoritos' : 'Guardar en mis favoritos'}
          aria-pressed={favorito}
        >
          {favorito ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="card-content">
        <div className="card-meta">
          <span className="card-category">{lugar.categoria}</span>
          <span className="card-location">📍 {lugar.municipio}</span>
        </div>
        <h3 className="card-title">{lugar.nombre}</h3>
        <p className="card-description">{lugar.descripcion}</p>
        <div className="card-footer">
          <div className="card-schedule-mini">
            <span>🕐 {(lugar.horario || '').slice(0, 38)}...</span>
          </div>
          <button className="btn btn-card-action" onClick={() => abrirLugar(lugar.id)}>
            VER PLAN ➔
          </button>
        </div>
      </div>
    </article>
  );
}
