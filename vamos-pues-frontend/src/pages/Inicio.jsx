import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PlaceCard from '../components/PlaceCard';
import { coincideBusquedaRapida, normalizar } from '../utils/filtros';
import { usarImagenRespaldo } from '../utils/constantes';

export default function Inicio() {
  const navigate = useNavigate();
  const { lugares, actualizarFiltros, abrirLugar } = useApp();
  const [texto, setTexto] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const inputRef = useRef(null);
  const resultadosRef = useRef(null);

  // Cerrar el autocompletado al hacer click fuera
  useEffect(() => {
    const alHacerClick = (e) => {
      if (resultadosRef.current && !resultadosRef.current.contains(e.target) && e.target !== inputRef.current) {
        setMostrarResultados(false);
      }
    };
    document.addEventListener('click', alHacerClick);
    return () => document.removeEventListener('click', alHacerClick);
  }, []);

  const termino = normalizar(texto.trim());
  const coincidencias = termino.length >= 2
    ? lugares.filter((l) => coincideBusquedaRapida(l, termino)).slice(0, 6)
    : [];
  const autocompletadoVisible = mostrarResultados && termino.length >= 2;

  const buscar = () => {
    if (!texto.trim()) return;
    actualizarFiltros({ busqueda: texto.trim() });
    setMostrarResultados(false);
    navigate('/explorar');
  };

  return (
    <section id="section-inicio" className="hero-section">
      <div className="container">

        {/* HERO PRINCIPAL */}
        <div className="hero-box">
          <span className="hero-sticker-tag">VALLE DE ABURRÁ · ENCUENTRA TU PRÓXIMO PARCHE</span>
          <h1 className="hero-title">DESCUBRE LA CIUDAD A TU MANERA</h1>
          <p className="hero-subtitle">
            Planes culturales, gastronómicos, centros comerciales, naturaleza, entretenimiento y vida nocturna al alcance de tu bolsillo.
          </p>

          {/* BUSCADOR DESTACADO CON AUTOCOMPLETADO */}
          <div className="hero-search-wrapper">
            <div className="search-input-group">
              <input
                ref={inputRef}
                type="text"
                id="hero-search-input"
                placeholder="¿Qué quieres hacer hoy? Ej: Cine Colombia, museo, parque, comida..."
                autoComplete="off"
                value={texto}
                onChange={(e) => { setTexto(e.target.value); setMostrarResultados(true); }}
                onKeyDown={(e) => { if (e.key === 'Enter') buscar(); }}
              />
              <button className="btn btn-hero-search" onClick={buscar}>
                BUSCAR 🔎
              </button>
            </div>
            {/* RESULTADOS DEL AUTOCOMPLETADO */}
            <div ref={resultadosRef} id="hero-search-results" className={`autocomplete-dropdown ${autocompletadoVisible ? '' : 'hidden'}`}>
              {autocompletadoVisible && coincidencias.length === 0 && (
                <div className="search-item-empty">
                  <span>😕 No encontramos parches con "{texto}".</span>
                </div>
              )}
              {autocompletadoVisible && coincidencias.map((l) => (
                <div key={l.id} className="search-item" onClick={() => { abrirLugar(l.id); setMostrarResultados(false); }}>
                  <img src={l.imagen} alt={l.nombre} className="search-item-thumb" onError={usarImagenRespaldo} />
                  <div className="search-item-info">
                    <div className="search-item-title">{l.nombre}</div>
                    <div className="search-item-meta">
                      <span className="badge-tag">{l.categoria}</span>
                      <span>📍 {l.municipio}</span>
                      <span className="price-val font-bold">{Number(l.precio) === 0 ? 'Gratis' : l.precioFormateado}</span>
                      {l.mayorDeEdad && <span className="badge-tag adult-tag text-xs">🔞 +18</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTONES DE ACCIÓN PRINCIPALES */}
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/explorar')}>
              🔎 EXPLORAR PLANES
            </button>
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/generador')}>
              🎲 ¿QUÉ HAGO HOY?
            </button>
            <button className="btn btn-orange" onClick={() => navigate('/mapa')}>
              🗺️ VER MAPA
            </button>
          </div>
        </div>

        {/* VISTA PREVIA DE PARCHES DESTACADOS */}
        <div className="mt-5">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔥 Parches Recomendados</h2>
              <p className="section-subtitle">Lugares icónicos y accesibles de nuestra comunidad joven</p>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/explorar')}>
              VER TODOS LOS PLANES ➔
            </button>
          </div>
          <div className="places-grid" id="hero-highlights-grid">
            {lugares.slice(0, 4).map((l) => <PlaceCard key={l.id} lugar={l} />)}
          </div>
        </div>

      </div>
    </section>
  );
}
