import { useNavigate } from 'react-router-dom';
import { useApp, FILTROS_INICIALES } from '../context/AppContext';

/** Cinta de información en vivo (ticker) debajo del encabezado. Cada ítem lleva a su sección. */
export default function StatsRibbon() {
  const navigate = useNavigate();
  const { lugares, cargado, actualizarFiltros } = useApp();

  const total = lugares.length;
  const gratis = lugares.filter((l) => Number(l.precio) === 0).length;
  const adultos = lugares.filter((l) => l.mayorDeEdad).length;

  // Abre Explorar con los filtros limpios más el filtro propio de cada ítem
  const explorarCon = (filtrosExtra) => {
    actualizarFiltros({ ...FILTROS_INICIALES, ...filtrosExtra });
    navigate('/explorar');
  };

  const items = [
    {
      id: 'ribbon-total-count',
      texto: cargado ? `${total} Lugares en el Valle` : '📍 26 Lugares en el Valle',
      accion: () => explorarCon({}),
    },
    {
      id: 'ribbon-free-count',
      texto: cargado ? `Planes desde $0 (${gratis} gratis)` : '💸 Planes desde $0 (Entrada Libre)',
      accion: () => explorarCon({ precioMaximo: 0, chipPrecioActivo: 0 }),
    },
    {
      id: undefined,
      texto: '🗺️ Mapa interactivo real',
      accion: () => navigate('/mapa'),
    },
    {
      id: 'ribbon-adult-count',
      texto: cargado ? `${adultos} Parches +18` : '🔞 Sección +18 identificada',
      accion: () => explorarCon({ edad: 'only_adult' }),
    },
  ];

  return (
    <aside className="stats-ribbon">
      <div className="container ribbon-items">
        {items.map((item) => (
          <div
            key={item.texto}
            className="ribbon-item"
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            onClick={item.accion}
            onKeyDown={(e) => { if (e.key === 'Enter') item.accion(); }}
          >
            <span className="ribbon-dot"></span>
            <span id={item.id}>{item.texto}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
