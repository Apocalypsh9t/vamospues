import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const LOGO = '/assets/img/logo-vamos-pues-transparent.svg';

export default function Header() {
  const navigate = useNavigate();
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const cerrarDrawer = () => setDrawerAbierto(false);

  return (
    <>
      {/* ENCABEZADO Y NAVEGACIÓN PRINCIPAL */}
      <header className="main-header">
        <div className="container header-content">

          {/* LOGO OFICIAL VAMOS PUES */}
          <NavLink to="/" end className="brand-logo-link">
            <img src={LOGO} alt="Vamos Pues - Encuentra tu próximo parche" className="brand-logo-img" />
          </NavLink>

          {/* NAVEGACIÓN ESCRITORIO */}
          <nav className="desktop-nav" aria-label="Navegación principal">
            <NavLink to="/explorar" className="nav-link">
              <span>🔎</span> Explorar
            </NavLink>
            <NavLink to="/generador" className="nav-link">
              <span>🎲</span> ¿Qué hago hoy?
            </NavLink>
            <NavLink to="/mapa" className="nav-link">
              <span>🗺️</span> Mapa
            </NavLink>
            <NavLink to="/sugerir" className="btn btn-nav-suggest">
              + SUGERIR LUGAR
            </NavLink>
            <button className="admin-lock-btn" onClick={() => navigate('/admin')} title="Panel de Administración Privado" aria-label="Administración">
              🔐
            </button>
          </nav>

          {/* BOTÓN MENÚ MÓVIL */}
          <button className="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Abrir menú de navegación" onClick={() => setDrawerAbierto((v) => !v)}>
            ☰
          </button>
        </div>
      </header>

      {/* DRAWER MÓVIL */}
      <div className={`mobile-nav-drawer ${drawerAbierto ? 'is-open' : ''}`} id="mobile-nav-drawer">
        <div className="drawer-header">
          <img src={LOGO} alt="Vamos Pues" style={{ height: '40px' }} />
          <button className="drawer-close-btn" id="close-drawer-btn" aria-label="Cerrar menú" onClick={cerrarDrawer}>✕</button>
        </div>
        <div className="drawer-links">
          <NavLink to="/" end className="drawer-link" onClick={cerrarDrawer}>🏠 Inicio</NavLink>
          <NavLink to="/explorar" className="drawer-link" onClick={cerrarDrawer}>🔎 Explorar planes</NavLink>
          <NavLink to="/generador" className="drawer-link" onClick={cerrarDrawer}>🎲 ¿Qué hago hoy?</NavLink>
          <NavLink to="/mapa" className="drawer-link" onClick={cerrarDrawer}>🗺️ Mapa interactivo</NavLink>
          <Link to="/sugerir" className="btn btn-accent mt-3" onClick={cerrarDrawer}>+ SUGERIR LUGAR</Link>
          <Link to="/admin" className="btn btn-outline mt-2" onClick={cerrarDrawer}>🔐 Panel de Administración</Link>
        </div>
      </div>
    </>
  );
}
