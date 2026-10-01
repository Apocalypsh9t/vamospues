import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { esGratis, formatearCOP, usarImagenRespaldo } from '../utils/constantes';

const ATAJOS_PRESUPUESTO = [
  { valor: '0', texto: '$0 (Gratis)' },
  { valor: '20000', texto: '$20.000' },
  { valor: '25000', texto: '$25.000' },
  { valor: '50000', texto: '$50.000' },
];

export default function Generador() {
  const { categorias, abrirLugar, verEnMapa } = useApp();
  const [presupuesto, setPresupuesto] = useState('20000');
  const [atajoActivo, setAtajoActivo] = useState('20000');
  const [categoria, setCategoria] = useState('todas');
  const [incluirMas18, setIncluirMas18] = useState(false);
  // null = sin resultado aún, 'cargando' = animación del dado, o el resultado del backend
  const [resultado, setResultado] = useState(null);
  const [ultimoPlanId, setUltimoPlanId] = useState(null);
  const resultadoRef = useRef(null);

  useEffect(() => {
    if (resultado && resultado !== 'cargando') {
      resultadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [resultado]);

  const generar = (montoForzado) => {
    const monto = parseInt(montoForzado ?? presupuesto, 10) || 0;
    setResultado('cargando');

    // Pequeña pausa para mostrar la animación del dado
    setTimeout(async () => {
      try {
        const { data } = await api.get('/lugares/generar', {
          params: { presupuesto: monto, categoria, incluirMayoresDeEdad: incluirMas18, excluirId: ultimoPlanId ?? undefined },
        });
        if (data.exito) setUltimoPlanId(data.plan.id);
        setResultado({ ...data, presupuestoIngresado: monto });
      } catch {
        setResultado(null);
        alert('No se pudo conectar con el servidor. Intenta de nuevo.');
      }
    }, 500);
  };

  const probarCon25000 = () => {
    setPresupuesto('25000');
    generar('25000');
  };

  return (
    <section id="section-generador" className="generator-section">
      <div className="container">
        <div className="generator-card">

          <div className="generator-header">
            <h2>🎲 ¿QUÉ HAGO HOY?</h2>
            <p>¿No sabes a dónde ir? Dinos cuánto tienes en el bolsillo y descubre un parche inesperado en cualquier rincón del Valle de Aburrá.</p>
          </div>

          {/* FORMULARIO DEL GENERADOR */}
          <div className="generator-form-box">

            <div className="mb-3">
              <label className="filter-label" htmlFor="generator-budget-input" style={{ fontSize: '1rem' }}>
                ¿Cuánto dinero tienes para el plan? (COP)
              </label>
              <div className="search-input-group mt-2">
                <span style={{ padding: '0 1rem', fontWeight: 900, fontSize: '1.25rem' }}>$</span>
                <input type="number" id="generator-budget-input" min="0" step="1000" placeholder="Ej: 20000" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} />
              </div>

              {/* ATAJOS DE PRESUPUESTO */}
              <div className="gen-quick-budget-chips">
                <span className="text-xs text-muted" style={{ alignSelf: 'center' }}>Atajos:</span>
                {ATAJOS_PRESUPUESTO.map((a) => (
                  <button
                    key={a.valor}
                    type="button"
                    className={`gen-quick-budget-btn ${atajoActivo === a.valor ? 'active' : ''}`}
                    onClick={() => { setAtajoActivo(a.valor); setPresupuesto(a.valor); }}
                  >
                    {a.texto}
                  </button>
                ))}
              </div>
            </div>

            {/* CATEGORÍA OPCIONAL */}
            <div className="mb-3">
              <label className="filter-label" htmlFor="generator-category-select">¿Alguna categoría en mente? (Opcional)</label>
              <select id="generator-category-select" className="select-custom w-100 mt-2" style={{ width: '100%' }} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="todas">Cualquiera (¡Sorpréndeme con lo que sea!)</option>
                {categorias.map((c) => <option key={c.id} value={c.nombre}>{c.icono} {c.nombre}</option>)}
              </select>
            </div>

            {/* CHECKBOX REGLA +18 */}
            <label className="generator-checkbox-wrap">
              <input type="checkbox" id="generator-adult-check" checked={incluirMas18} onChange={(e) => setIncluirMas18(e.target.checked)} />
              <span style={{ fontWeight: 'bold' }}>
                🔞 Incluir planes de vida nocturna exclusivos para mayores de edad (+18)
              </span>
            </label>

            {/* BOTÓN PRINCIPAL */}
            <button id="btn-surprise-me" className="btn btn-primary btn-lg w-100 mt-3" style={{ width: '100%' }} onClick={() => generar()}>
              🎲 ¡SORPRÉNDEME! BUSCAR PARCHE
            </button>

          </div>

          {/* CONTENEDOR DEL RESULTADO O ALTERNATIVAS */}
          <div id="generator-result-box" ref={resultadoRef} className={resultado ? '' : 'hidden'}>
            {resultado === 'cargando' && (
              <div className="generator-rolling">
                <div className="spin-die">🎲</div>
                <h3>Buscando tu próximo parche...</h3>
                <p>Revisando lugares en el Valle de Aburrá acordes a tu bolsillo</p>
              </div>
            )}
            {resultado && resultado !== 'cargando' && resultado.exito && (
              <PlanGanador plan={resultado.plan} abrirLugar={abrirLugar} verEnMapa={verEnMapa} otroPlan={() => generar()} />
            )}
            {resultado && resultado !== 'cargando' && !resultado.exito && (
              <SinResultados resultado={resultado} abrirLugar={abrirLugar} probarCon25000={probarCon25000} />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

function PlanGanador({ plan: p, abrirLugar, verEnMapa, otroPlan }) {
  const gratis = esGratis(p);
  return (
    <div className="generator-card-winner">
      <div className="winner-badge">🎲 ¡TU PRÓXIMO PARCHE!</div>
      <div className="winner-inner">
        <img src={p.imagen} alt={p.nombre} className="winner-img" onError={usarImagenRespaldo} />
        <div className="winner-info">
          <div className="d-flex align-center gap-2 mb-2 wrap">
            <span className="badge-tag" style={{ background: '#FE8616', color: '#0D0127' }}>{p.categoria}</span>
            <span className={`badge-tag price-tag ${gratis ? 'is-free' : ''}`}>💰 {gratis ? 'GRATIS ($0)' : p.precioFormateado}</span>
            {p.mayorDeEdad && <span className="badge-tag adult-tag">🔞 EXCLUSIVO +18</span>}
          </div>
          <h2 className="winner-title">{p.nombre}</h2>
          <p className="winner-desc">{p.descripcion}</p>
          <div className="winner-details mt-3">
            <div>📍 <strong>Ubicación:</strong> {p.municipio} · {p.direccion}</div>
            <div>🕐 <strong>Horario:</strong> {p.horario}</div>
            <div>🚇 <strong>Llegada:</strong> {p.comoLlegar}</div>
          </div>
          <div className="d-flex gap-3 mt-4 wrap">
            <button className="btn btn-primary" onClick={() => abrirLugar(p.id)}>
              VER FICHA COMPLETA ➔
            </button>
            <button className="btn btn-outline" onClick={() => verEnMapa(p.id)}>
              🗺️ VER EN EL MAPA
            </button>
            <button className="btn btn-secondary" onClick={otroPlan}>
              🎲 ¡DAME OTRO PARCHE!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sin resultados exactos: "😭 No encontramos planes..." y debajo las opciones cercanas
function SinResultados({ resultado, abrirLugar, probarCon25000 }) {
  return (
    <div className="generator-no-results">
      <div className="no-results-header">
        <div className="big-sad-emoji">😭</div>
        <h3>No encontramos planes dentro de tu presupuesto de ${formatearCOP(resultado.presupuestoIngresado)} COP.</h3>
      </div>
      {resultado.alternativas.length > 0 ? (
        <div className="alternatives-wrapper mt-4">
          <div className="alt-banner">
            💡 Pero encontramos estas opciones cerca de ${formatearCOP(resultado.diferenciaMasCercana)} más:
          </div>
          <div className="alternatives-grid mt-3">
            {resultado.alternativas.map((alt) => (
              <div key={alt.id} className="alternative-card">
                <img src={alt.imagen} alt={alt.nombre} className="alt-img" onError={usarImagenRespaldo} />
                <div className="alt-info">
                  <span className="badge-tag">{alt.categoria}</span>
                  <h4 className="font-bold">{alt.nombre}</h4>
                  <div className="alt-price">💰 {alt.precioFormateado}</div>
                  <p className="text-xs text-muted">{alt.municipio} · {alt.direccion}</p>
                  <button className="btn btn-sm btn-outline mt-2" onClick={() => abrirLugar(alt.id)}>
                    VER PLAN ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-3">Intenta cambiar la categoría o aumentar el presupuesto para encontrar más opciones.</p>
      )}
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={probarCon25000}>
          PROBAR CON $25.000 COP
        </button>
      </div>
    </div>
  );
}
