import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api, { getErrorMessage } from '../services/api';
import { MUNICIPIOS } from '../utils/constantes';

const FORM_INICIAL = {
  nombre: '', categoria: 'Cultura', municipio: 'Medellín', direccion: '', precio: '', horario: '',
  descripcion: '', comoLlegar: '', sitioWeb: '', imagen: '', informacionAdicional: '', mayorDeEdad: false,
};

export default function Sugerir() {
  const navigate = useNavigate();
  const { categorias } = useApp();
  const [form, setForm] = useState(FORM_INICIAL);
  const [graciasAbierto, setGraciasAbierto] = useState(false);

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      alert('Por favor escribe el nombre del lugar.');
      return;
    }
    try {
      await api.post('/sugerencias', { ...form, precio: form.precio ? parseInt(form.precio, 10) : 0 });
      setForm(FORM_INICIAL);
      setGraciasAbierto(true);
    } catch (err) {
      alert(getErrorMessage(err, 'No se pudo enviar la sugerencia. Intenta de nuevo.'));
    }
  };

  return (
    <>
      <section id="section-sugerir" className="py-5">
        <div className="container" style={{ maxWidth: '780px' }}>

          <div className="section-header text-center" style={{ justifyContent: 'center' }}>
            <div>
              <h1 className="section-title justify-center">➕ SUGERIR UN LUGAR</h1>
              <p className="section-subtitle">¿Conoces un lugar que todavía no tenemos? Compártelo con la comunidad de Vamos Pues.</p>
            </div>
          </div>

          <div className="filters-panel mt-3">
            <form id="suggest-place-form" onSubmit={enviar}>

              <div className="mb-3">
                <label className="filter-label">Nombre del lugar *</label>
                <input type="text" name="nombre" value={form.nombre} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} required placeholder="Ej: Mirador de Belén Rincón" />
              </div>

              <div className="d-flex gap-2 wrap mb-3">
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label className="filter-label">Categoría *</label>
                  <select name="categoria" value={form.categoria} onChange={cambiar} className="select-custom w-100" style={{ width: '100%' }}>
                    {categorias.map((c) => <option key={c.id} value={c.nombre}>{c.icono} {c.nombre}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label className="filter-label">Municipio del Valle *</label>
                  <select name="municipio" value={form.municipio} onChange={cambiar} className="select-custom w-100" style={{ width: '100%' }}>
                    {MUNICIPIOS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="filter-label">Dirección o punto de referencia</label>
                <input type="text" name="direccion" value={form.direccion} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} placeholder="Ej: Calle 30A # 55-64, Belén" />
              </div>

              <div className="d-flex gap-2 wrap mb-3">
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="filter-label">Precio estimado por persona (COP)</label>
                  <input type="number" name="precio" value={form.precio} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} placeholder="0 para gratis o ej: 15000" min="0" />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="filter-label">Horario aproximado</label>
                  <input type="text" name="horario" value={form.horario} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} placeholder="Ej: Martes a domingo 10am a 6pm" />
                </div>
              </div>

              <div className="mb-3">
                <label className="filter-label">Descripción del parche</label>
                <textarea name="descripcion" value={form.descripcion} onChange={cambiar} className="input-custom w-100" style={{ width: '100%', minHeight: '90px' }} placeholder="¿De qué trata este lugar? ¿Qué actividades se pueden hacer?"></textarea>
              </div>

              <div className="mb-3">
                <label className="filter-label">¿Cómo llegar en transporte público?</label>
                <input type="text" name="comoLlegar" value={form.comoLlegar} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} placeholder="Ej: Metro Estación San Antonio y tomar bus integrado..." />
              </div>

              <div className="d-flex gap-2 wrap mb-3">
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="filter-label">Redes o sitio web oficial</label>
                  <input type="text" name="sitioWeb" value={form.sitioWeb} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} placeholder="https://... o @usuario" />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="filter-label">Enlace a una foto (opcional)</label>
                  <input type="url" name="imagen" value={form.imagen} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} placeholder="https://images.unsplash.com/..." />
                </div>
              </div>

              <div className="mb-3">
                <label className="filter-label">Información adicional o recomendaciones</label>
                <input type="text" name="informacionAdicional" value={form.informacionAdicional} onChange={cambiar} className="input-custom w-100" style={{ width: '100%' }} placeholder="Ej: Mejor ir al atardecer, llevar saco..." />
              </div>

              <label className="generator-checkbox-wrap">
                <input type="checkbox" name="mayorDeEdad" checked={form.mayorDeEdad} onChange={cambiar} />
                <span>🔞 ¿Es un lugar exclusivo para mayores de edad (+18)?</span>
              </label>

              <button type="submit" className="btn btn-primary btn-lg w-100 mt-4" style={{ width: '100%' }}>
                ENVIAR SUGERENCIA ➔
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* MODAL: SUGERENCIA ENVIADA */}
      <div className={`modal ${graciasAbierto ? 'is-open' : ''}`} id="suggest-success-modal" role="dialog" aria-modal="true">
        <div className="modal-dialog" style={{ maxWidth: '480px', textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>💜</div>
          <h2 style={{ color: 'var(--color-majorelle)' }}>¡GRACIAS POR COMPARTIR!</h2>
          <p className="mt-3" style={{ fontSize: '1.15rem', lineHeight: 1.5 }}>
            Revisaremos tu sugerencia antes de agregarla a Vamos Pues. 💜
          </p>
          <p className="text-xs text-muted mt-2">Un administrador verificará la información para que toda la comunidad del Valle pueda descubrirlo.</p>
          <button className="btn btn-primary mt-4" onClick={() => { setGraciasAbierto(false); navigate('/explorar'); }}>
            SEGUIR EXPLORANDO
          </button>
        </div>
      </div>
    </>
  );
}
