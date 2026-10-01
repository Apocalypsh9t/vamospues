import { NavLink, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <img src="/assets/img/logo-vamos-pues-transparent.svg" alt="Vamos Pues" style={{ height: '50px', marginBottom: '0.75rem' }} />
            <h3 className="footer-brand-title">“Encuentra tu próximo parche.”</h3>
            <p className="footer-tagline">
              Plataforma creada para jóvenes del Área Metropolitana del Valle de Aburrá. Descubre, vive y conéctate con tu ciudad sin que el costo o la falta de información sean una barrera.
            </p>
          </div>

          <div className="footer-col">
            <h4>NAVEGACIÓN</h4>
            <ul className="footer-links">
              <li><NavLink to="/" end>Inicio</NavLink></li>
              <li><NavLink to="/explorar">Explorar planes</NavLink></li>
              <li><NavLink to="/generador">¿Qué hago hoy?</NavLink></li>
              <li><NavLink to="/mapa">Mapa interactivo</NavLink></li>
              <li><NavLink to="/sugerir">+ Sugerir lugar</NavLink></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>MUNICIPIOS DEL VALLE</h4>
            <ul className="footer-links" style={{ fontSize: '0.85rem', color: '#AAA' }}>
              <li>Medellín · Envigado · Sabaneta</li>
              <li>Bello · Itagüí · La Estrella</li>
              <li>Caldas · Copacabana · Girardota</li>
              <li>Barbosa · Santa Elena · San Félix</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 <strong>VAMOS PUES</strong> · Todos los derechos reservados. Valle de Aburrá, Colombia.</div>
          <div className="d-flex gap-2 align-center">
            <span>💜 Hecho para parceros del Valle</span>
            <button className="admin-lock-btn" onClick={() => navigate('/admin')} title="Acceso de Administración">
              🔐 Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
