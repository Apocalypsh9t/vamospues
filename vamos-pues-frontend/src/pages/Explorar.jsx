import { useApp } from '../context/AppContext';
import PlaceCard from '../components/PlaceCard';
import { filtrarLugares } from '../utils/filtros';
import { MUNICIPIOS, PRECIO_SIN_LIMITE, formatearCOP } from '../utils/constantes';

const ATAJOS_PRECIO = [
  { valor: 0, texto: '$0 (Gratis)' },
  { valor: 15000, texto: '$15.000' },
  { valor: 25000, texto: '$25.000' },
  { valor: 50000, texto: '$50.000' },
  { valor: PRECIO_SIN_LIMITE, texto: 'Sin límite' },
];

const textoPrecio = (valor) =>
  valor >= PRECIO_SIN_LIMITE ? '$100.000+ (Sin límite)' : `$${formatearCOP(valor)} COP`;

export default function Explorar() {
  const { lugares, categorias, cargado, filtros, actualizarFiltros, restablecerFiltros, favoritos } = useApp();
  const resultados = filtrarLugares(lugares, filtros, favoritos);

  const alternarCategoria = (nombre) => {
    const yaEsta = filtros.categorias.includes(nombre);
    actualizarFiltros({
      categorias: yaEsta ? filtros.categorias.filter((c) => c !== nombre) : [...filtros.categorias, nombre],
    });
  };

  return (
    <section id="section-explorar" className="py-5">
      <div className="container">

        <div className="section-header">
          <div>
            <h1 className="section-title">🔎 EXPLORA TU PRÓXIMO PARCHE</h1>
            <p className="section-subtitle">Filtra por presupuesto, categoría o municipio y encuentra exactamente lo que buscas.</p>
          </div>
          <div id="explore-results-count" className="badge-tag" style={{ background: 'var(--color-chartreuse)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            {cargado
              ? `${resultados.length} ${resultados.length === 1 ? 'parche encontrado' : 'parches encontrados'}`
              : 'Cargando parches...'}
          </div>
        </div>

        {/* PANEL DE FILTROS CENTRALIZADO */}
        <div className="filters-panel">

          <div className="filters-row">

            {/* BUSCADOR INTERNO */}
            <div className="filter-group" style={{ flex: 1.5 }}>
              <label className="filter-label">Buscar por palabra clave</label>
              <input
                type="text"
                id="explore-search-input"
                className="input-custom"
                placeholder="Nombre, barrio, comida, aire libre, evento..."
                value={filtros.busqueda}
                onChange={(e) => actualizarFiltros({ busqueda: e.target.value })}
              />
            </div>

            {/* FILTRO DE PRECIO MAXIMO (REGLA ESTRICTA) */}
            <div className="filter-group" style={{ flex: 2 }}>
              <div className="filter-label">
                <span>Presupuesto Máximo:</span>
                <strong id="price-slider-display" style={{ color: 'var(--color-orange)' }}>{textoPrecio(filtros.precioMaximo)}</strong>
              </div>
              <div className="range-slider-wrap">
                <input
                  type="range"
                  id="price-range-slider"
                  min="0"
                  max="100000"
                  step="5000"
                  value={Math.min(filtros.precioMaximo, PRECIO_SIN_LIMITE)}
                  onChange={(e) => actualizarFiltros({ precioMaximo: parseInt(e.target.value, 10) })}
                />
                <div className="quick-price-chips">
                  <span className="text-xs text-muted" style={{ alignSelf: 'center' }}>Atajos:</span>
                  {ATAJOS_PRECIO.map((a) => (
                    <button
                      key={a.valor}
                      type="button"
                      className={`quick-price-btn ${filtros.chipPrecioActivo === a.valor ? 'active' : ''}`}
                      onClick={() => actualizarFiltros({ precioMaximo: a.valor, chipPrecioActivo: a.valor })}
                    >
                      {a.texto}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FILTRO POR MUNICIPIO */}
            <div className="filter-group">
              <label className="filter-label">Municipio del Valle</label>
              <select id="municipality-select" className="select-custom" value={filtros.municipio} onChange={(e) => actualizarFiltros({ municipio: e.target.value })}>
                <option value="Todos">Todos los municipios</option>
                {MUNICIPIOS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* FILTRO EDAD +18 */}
            <div className="filter-group" style={{ minWidth: '170px' }}>
              <label className="filter-label">Filtro de Edad</label>
              <div className="d-flex gap-2 align-center" style={{ marginTop: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="adult-filter-radio" value="all" checked={filtros.edad === 'all'} onChange={() => actualizarFiltros({ edad: 'all' })} /> Todos
                </label>
                <label style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="adult-filter-radio" value="no_adult" checked={filtros.edad === 'no_adult'} onChange={() => actualizarFiltros({ edad: 'no_adult' })} /> Solo -18
                </label>
                <label style={{ fontSize: '0.85rem', cursor: 'pointer', color: 'var(--color-pink)', fontWeight: 'bold' }}>
                  <input type="radio" name="adult-filter-radio" value="only_adult" checked={filtros.edad === 'only_adult'} onChange={() => actualizarFiltros({ edad: 'only_adult' })} /> 🔞 +18
                </label>
              </div>
            </div>

            {/* ORDENAMIENTO */}
            <div className="filter-group" style={{ minWidth: '160px' }}>
              <label className="filter-label">Ordenar por</label>
              <select id="sort-places-select" className="select-custom" value={filtros.orden} onChange={(e) => actualizarFiltros({ orden: e.target.value })}>
                <option value="default">Recomendados</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="name">Nombre alfabético</option>
              </select>
            </div>

            {/* BOTÓN RESET */}
            <div className="filter-group" style={{ minWidth: 'auto', alignSelf: 'flex-end' }}>
              <button id="reset-filters-btn" className="btn btn-outline btn-sm" title="Restablecer todos los filtros" onClick={restablecerFiltros}>
                🔄 Limpiar
              </button>
            </div>

          </div>

          {/* BARRA DE CHIPS DE CATEGORÍAS (MULTI-SELECCIÓN) */}
          <div className="category-chips-bar" id="category-chips-container">
            <button className={`chip-filter ${filtros.categorias.length === 0 ? 'active' : ''}`} onClick={() => actualizarFiltros({ categorias: [] })}>
              ⚡ Todas
            </button>
            {categorias.map((c) => (
              <button key={c.id} className={`chip-filter ${filtros.categorias.includes(c.nombre) ? 'active' : ''}`} onClick={() => alternarCategoria(c.nombre)}>
                {c.icono} {c.nombre}
              </button>
            ))}
            <button
              className={`chip-filter chip-favoritos ${filtros.soloFavoritos ? 'active' : ''}`}
              onClick={() => actualizarFiltros({ soloFavoritos: !filtros.soloFavoritos })}
              title="Ver solo los planes que guardaste con el corazón"
            >
              ❤️ Mis favoritos ({favoritos.length})
            </button>
          </div>

        </div>

        {/* CUADRÍCULA DE TARJETAS DE LUGARES */}
        <div className="places-grid" id="explore-places-grid">
          {cargado && resultados.length === 0 ? (
            <div className="empty-state-box">
              <div className="empty-icon">😭</div>
              <h3>{filtros.soloFavoritos && favoritos.length === 0 ? '¡Todavía no tienes favoritos!' : '¡No encontramos planes con estos filtros!'}</h3>
              <p>{filtros.soloFavoritos && favoritos.length === 0
                ? 'Toca el 🤍 de cualquier plan para guardarlo aquí y encontrarlo rápido después.'
                : 'Prueba aumentando tu presupuesto, seleccionando más categorías o quitando filtros.'}</p>
              <button className="btn btn-primary mt-4" onClick={restablecerFiltros}>
                🔄 RESTABLECER FILTROS
              </button>
            </div>
          ) : (
            resultados.map((l) => <PlaceCard key={l.id} lugar={l} />)
          )}
        </div>

      </div>
    </section>
  );
}
