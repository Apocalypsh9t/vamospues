const porcentaje = (cantidad, total) => `${Math.round((cantidad / total) * 100)}% (${cantidad})`;

export default function TabEncuestas({ encuestas }) {
  const total = encuestas.length;
  const facil = encuestas.filter((e) => e.encontroFacil).length;
  const volveria = encuestas.filter((e) => e.volveriaAUsar).length;
  const conComentario = encuestas.filter((e) => e.sugerencia && e.sugerencia.length > 0);

  return (
    <div id="admin-tab-content-surveys">
      <h3 className="mb-3">Métricas y Opinión de la Juventud</h3>
      <div className="d-flex gap-3 wrap mb-4">
        <div className="filters-panel" style={{ flex: 1, textAlign: 'center' }}>
          <span className="text-xs text-muted font-bold">TOTAL RESPUESTAS</span>
          <div id="admin-survey-total" style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', color: 'var(--color-majorelle)' }}>{total}</div>
        </div>
        <div className="filters-panel" style={{ flex: 1, textAlign: 'center' }}>
          <span className="text-xs text-muted font-bold">¿ENCONTRÓ FÁCILMENTE? (SÍ)</span>
          <div id="admin-survey-easy-yes" style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', color: 'var(--color-orange)' }}>{total > 0 ? porcentaje(facil, total) : '0%'}</div>
        </div>
        <div className="filters-panel" style={{ flex: 1, textAlign: 'center' }}>
          <span className="text-xs text-muted font-bold">¿VOLVERÍA A USAR VAMOS PUES? (SÍ)</span>
          <div id="admin-survey-again-yes" style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', color: 'var(--color-pink)' }}>{total > 0 ? porcentaje(volveria, total) : '0%'}</div>
        </div>
      </div>

      <h4>Comentarios y sugerencias recibidas:</h4>
      <div id="admin-survey-comments-list" className="mt-3">
        {conComentario.length === 0 ? (
          <p className="text-muted py-3">No hay comentarios ni sugerencias escritas aún.</p>
        ) : conComentario.map((e) => (
          <div key={e.id} className="admin-comment-item">
            <p>“{e.sugerencia}”</p>
            <small className="text-muted">
              {new Date(e.fechaCreacion).toLocaleDateString('es-CO')} · ¿Encontró fácil? {e.encontroFacil ? 'Sí' : 'No'} · ¿Volvería? {e.volveriaAUsar ? 'Sí' : 'No'}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
