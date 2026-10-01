import { useEffect, useState } from 'react';
import api from '../services/api';

const ENCUESTA_RESPONDIDA_KEY = 'vamos_pues_survey_completed_v1';

/** Pop-up de encuesta no invasivo + botón flotante "¿Opinión?". */
export default function SurveyModal() {
  const [abierta, setAbierta] = useState(false);
  const [enviada, setEnviada] = useState(false);
  const [form, setForm] = useState({ encontroFacil: 'si', volveriaAUsar: 'si', sugerencia: '' });

  // Se abre sola a los 45 segundos si el usuario aún no la ha respondido
  // y no hay otro modal abierto en ese momento
  useEffect(() => {
    if (localStorage.getItem(ENCUESTA_RESPONDIDA_KEY)) return undefined;
    const timer = setTimeout(() => {
      if (!document.querySelector('.modal.is-open')) setAbierta(true);
    }, 45000);
    return () => clearTimeout(timer);
  }, []);

  const enviar = async (e) => {
    e.preventDefault();
    try {
      await api.post('/encuestas', {
        encontroFacil: form.encontroFacil === 'si',
        volveriaAUsar: form.volveriaAUsar === 'si',
        sugerencia: form.sugerencia,
      });
    } catch (err) {
      console.error('No se pudo guardar la encuesta:', err);
    }
    localStorage.setItem(ENCUESTA_RESPONDIDA_KEY, 'true');
    setEnviada(true);
    setTimeout(() => setAbierta(false), 4000);
  };

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <>
      <div className={`modal ${abierta ? 'is-open' : ''}`} id="survey-popup-modal" role="dialog" aria-modal="true">
        <div className="modal-dialog" style={{ maxWidth: '520px', padding: '2rem' }}>
          <button className="modal-close-corner" onClick={() => setAbierta(false)} aria-label="Cerrar">✕</button>
          <div id="survey-content-wrap">
            {enviada ? (
              <div className="survey-thank-you text-center">
                <div className="thank-emoji">💜</div>
                <h3>¡Muchas gracias por tu tiempo!</h3>
                <p className="mt-2">¡Gracias por ayudarnos a mejorar Vamos Pues! Tus respuestas hacen que la plataforma sea más bacana para todos.</p>
                <button className="btn btn-primary mt-4" onClick={() => setAbierta(false)}>
                  VOLVER A EXPLORAR
                </button>
              </div>
            ) : (
              <>
                <div className="d-flex align-center gap-2 mb-2">
                  <span style={{ fontSize: '1.8rem' }}>📝</span>
                  <h3 style={{ color: 'var(--color-majorelle)' }}>¿NOS AYUDAS CON TU OPINIÓN?</h3>
                </div>
                <p className="text-muted mb-4">Nos ayudarías muchísimo respondiendo estas pregunticas para hacer de Vamos Pues un mejor parche.</p>

                <form id="survey-form" onSubmit={enviar}>
                  <div className="mb-3">
                    <label className="filter-label" style={{ textTransform: 'none', fontSize: '0.95rem' }}>1. ¿Encontraste fácilmente lo que buscabas?</label>
                    <div className="d-flex gap-3 mt-1">
                      <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer' }}>
                        <input type="radio" name="encontroFacil" value="si" checked={form.encontroFacil === 'si'} onChange={cambiar} /> Sí 👍
                      </label>
                      <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer' }}>
                        <input type="radio" name="encontroFacil" value="no" checked={form.encontroFacil === 'no'} onChange={cambiar} /> No 👎
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="filter-label" style={{ textTransform: 'none', fontSize: '0.95rem' }}>2. ¿Volverías a utilizar Vamos Pues?</label>
                    <div className="d-flex gap-3 mt-1">
                      <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer' }}>
                        <input type="radio" name="volveriaAUsar" value="si" checked={form.volveriaAUsar === 'si'} onChange={cambiar} /> ¡Claro que sí! 🔥
                      </label>
                      <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer' }}>
                        <input type="radio" name="volveriaAUsar" value="no" checked={form.volveriaAUsar === 'no'} onChange={cambiar} /> Tal vez no
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="filter-label" style={{ textTransform: 'none', fontSize: '0.95rem' }}>3. ¿Tienes alguna sugerencia o idea bacana?</label>
                    <textarea name="sugerencia" value={form.sugerencia} onChange={cambiar} className="input-custom w-100 mt-1" style={{ width: '100%', minHeight: '70px' }} placeholder="Cuéntanos qué te gustaría ver..."></textarea>
                  </div>

                  <button type="submit" className="btn btn-accent w-100 mt-2" style={{ width: '100%' }}>
                    ENVIAR OPINIÓN ➔
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* BOTÓN FLOTANTE PARA ABRIR LA ENCUESTA CUANDO EL USUARIO DESEE */}
      <button className="survey-float-btn" onClick={() => setAbierta(true)} title="Dar opinión">
        <span>📝</span> ¿Opinión?
      </button>
    </>
  );
}
