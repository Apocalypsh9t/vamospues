import { useCallback, useEffect, useState } from 'react';
import api, { ADMIN_TOKEN_KEY, esSesionExpirada, getErrorMessage } from '../services/api';
import TabLugares from '../components/admin/TabLugares';
import TabSugerencias from '../components/admin/TabSugerencias';
import TabCategorias from '../components/admin/TabCategorias';
import TabEncuestas from '../components/admin/TabEncuestas';
import TabRespaldo from '../components/admin/TabRespaldo';

const PESTANAS = [
  { id: 'places', texto: '📍 Lugares y Eventos' },
  { id: 'suggestions', texto: '📬 Sugerencias de Usuarios' },
  { id: 'categories', texto: '🗂️ Categorías' },
  { id: 'surveys', texto: '📝 Encuestas y Feedback' },
  { id: 'backup', texto: '💾 Copia de Seguridad y JSON' },
];

export default function Admin() {
  const [autenticado, setAutenticado] = useState(() => Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY)));
  const [clave, setClave] = useState('');
  const [pestana, setPestana] = useState('places');
  const [sugerencias, setSugerencias] = useState([]);
  const [encuestas, setEncuestas] = useState([]);

  const cerrarSesion = useCallback(() => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setAutenticado(false);
    setClave('');
  }, []);

  // Manejo común de errores del panel: si el token venció se vuelve a pedir la clave
  const manejarError = useCallback((err, mensajePorDefecto) => {
    if (esSesionExpirada(err)) {
      alert('Tu sesión de administrador expiró. Ingresa la clave de nuevo.');
      cerrarSesion();
      return;
    }
    alert(getErrorMessage(err, mensajePorDefecto));
  }, [cerrarSesion]);

  const cargarSugerencias = useCallback(async () => {
    try {
      const { data } = await api.get('/sugerencias');
      setSugerencias(data);
    } catch (err) {
      manejarError(err, 'No se pudieron cargar las sugerencias.');
    }
  }, [manejarError]);

  const cargarEncuestas = useCallback(async () => {
    try {
      const { data } = await api.get('/encuestas');
      setEncuestas(data);
    } catch (err) {
      manejarError(err, 'No se pudieron cargar las encuestas.');
    }
  }, [manejarError]);

  useEffect(() => {
    if (autenticado) {
      cargarSugerencias();
      cargarEncuestas();
    }
  }, [autenticado, cargarSugerencias, cargarEncuestas]);

  const ingresar = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/admin/login', { clave });
      sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setPestana('places');
      setAutenticado(true);
    } catch (err) {
      alert(getErrorMessage(err, 'Clave de acceso incorrecta.'));
    }
  };

  const mostrarPestana = (id) => {
    setPestana(id);
    if (id === 'suggestions') cargarSugerencias();
    if (id === 'surveys') cargarEncuestas();
  };

  const pendientes = sugerencias.filter((s) => s.estado === 'pendiente').length;

  return (
    <section id="section-admin" className="admin-section">
      <div className="container">

        {/* PANTALLA DE ACCESO CON CONTRASEÑA */}
        <div id="admin-login-overlay" className={`admin-login-box ${autenticado ? 'hidden' : ''}`}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔐</div>
          <h2>ACCESO AL SISTEMA DE ADMINISTRACIÓN</h2>
          <p className="text-muted mt-2">Introduce la clave de acceso de administradores de Vamos Pues para gestionar contenido sin editar código.</p>
          <form id="admin-login-form" className="mt-4" onSubmit={ingresar}>
            <input type="password" id="admin-pin-input" className="input-custom text-center font-bold mb-3" style={{ width: '100%', fontSize: '1.25rem', letterSpacing: '2px' }} placeholder="Clave de acceso..." required value={clave} onChange={(e) => setClave(e.target.value)} />
            <button type="submit" className="btn btn-primary w-100" style={{ width: '100%' }}>
              INGRESAR AL PANEL ➔
            </button>
          </form>
        </div>

        {/* DASHBOARD DE ADMINISTRACIÓN (UNA VEZ AUTENTICADO) */}
        {autenticado && (
          <div id="admin-dashboard-wrap">

            <div className="d-flex justify-between align-center wrap gap-2 mb-3">
              <div>
                <h1 className="section-title">⚙️ PANEL DE CONTROL CENTRALIZADO</h1>
                <p className="text-muted">Los cambios que realices aquí se reflejan de inmediato en toda la plataforma pública.</p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={cerrarSesion}>
                🔒 Cerrar Sesión
              </button>
            </div>

            {/* PESTAÑAS DE ADMINISTRACIÓN */}
            <div className="admin-nav-tabs">
              {PESTANAS.map((p) => (
                <button key={p.id} id={`admin-tab-btn-${p.id}`} className={`admin-tab-btn ${pestana === p.id ? 'active' : ''}`} onClick={() => mostrarPestana(p.id)}>
                  {p.texto}
                  {p.id === 'suggestions' && (
                    <> <span id="admin-pending-sug-badge" className="badge-tag adult-tag" style={{ display: pendientes > 0 ? 'inline-block' : 'none', padding: '1px 6px' }}>{pendientes}</span></>
                  )}
                </button>
              ))}
            </div>

            {pestana === 'places' && <TabLugares manejarError={manejarError} />}
            {pestana === 'suggestions' && (
              <TabSugerencias sugerencias={sugerencias} recargar={cargarSugerencias} manejarError={manejarError} />
            )}
            {pestana === 'categories' && <TabCategorias manejarError={manejarError} />}
            {pestana === 'surveys' && <TabEncuestas encuestas={encuestas} />}
            {pestana === 'backup' && (
              <TabRespaldo manejarError={manejarError} alImportar={() => { cargarSugerencias(); cargarEncuestas(); }} />
            )}

          </div>
        )}

      </div>
    </section>
  );
}
