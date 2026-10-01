import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { formatearCOP } from '../../utils/constantes';
import PlaceFormModal from './PlaceFormModal';

const ESTADOS = {
  pendiente: <span className="badge-tag" style={{ background: '#FE8616', color: '#0D0127' }}>🟡 Pendiente</span>,
  aprobada: <span className="badge-tag" style={{ background: '#DFF800', color: '#0D0127' }}>🟢 Aprobada</span>,
  rechazada: <span className="badge-tag" style={{ background: '#fa05b8', color: '#fff' }}>🔴 Rechazada</span>,
};

export default function TabSugerencias({ sugerencias, recargar, manejarError }) {
  const { recargarDatos } = useApp();
  // Sugerencia que se está revisando antes de publicarla (null = formulario cerrado)
  const [enRevision, setEnRevision] = useState(null);

  // Al aprobar se abre el formulario ya lleno: el admin corrige lo que haga falta
  // (sobre todo la ubicación en el mapa) y al guardar se publica el lugar.
  const publicar = async (datos) => {
    try {
      const { data: nuevoLugar } = await api.put(`/sugerencias/${enRevision.id}/aprobar`, datos);
      alert(`🎉 ¡Lugar "${nuevoLugar.nombre}" publicado en Vamos Pues! Ahora aparece en Explorar, Buscador, Mapa y Generador.`);
      setEnRevision(null);
      await Promise.all([recargar(), recargarDatos()]);
    } catch (err) {
      manejarError(err, 'No se pudo aprobar la sugerencia.');
    }
  };

  const rechazar = async (id) => {
    if (!confirm('¿Rechazar esta sugerencia?')) return;
    try {
      await api.put(`/sugerencias/${id}/rechazar`);
      await recargar();
    } catch (err) {
      manejarError(err, 'No se pudo rechazar la sugerencia.');
    }
  };

  return (
    <div id="admin-tab-content-suggestions">
      <h3 className="mb-3">Sugerencias enviadas por los usuarios</h3>
      <p className="text-muted mb-3">Revisa las sugerencias antes de que se vuelvan públicas. Al dar "Revisar y Publicar" podrás corregir los datos y ubicarla en el mapa; al guardar se convertirá automáticamente en un registro activo.</p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Lugar Sugerido</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Detalles</th>
              <th>Revisión</th>
            </tr>
          </thead>
          <tbody id="admin-suggestions-table-body">
            {sugerencias.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No hay sugerencias enviadas por usuarios en este momento.
                </td>
              </tr>
            ) : sugerencias.map((s, idx) => (
              <tr key={s.id}>
                <td><strong>#{idx + 1}</strong></td>
                <td>
                  <div className="font-bold">{s.nombre}</div>
                  <small className="text-muted">{s.municipio} · {s.direccion || 'Sin dirección'}</small>
                </td>
                <td><span className="badge-tag">{s.categoria}</span></td>
                <td>{Number(s.precio) === 0 ? 'Gratis' : `$${formatearCOP(s.precio)}`}</td>
                <td>{ESTADOS[s.estado] || ESTADOS.pendiente}</td>
                <td>
                  <div className="text-xs text-muted" style={{ maxWidth: '250px' }}>
                    {s.descripcion || s.informacionAdicional || 'Sin detalles extra'}
                  </div>
                </td>
                <td>
                  {s.estado === 'pendiente' ? (
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-approve" onClick={() => setEnRevision(s)}>
                        ✅ Revisar y Publicar
                      </button>
                      <button className="btn btn-sm btn-delete" onClick={() => rechazar(s.id)}>
                        ❌ Rechazar
                      </button>
                    </div>
                  ) : (
                    <span className="text-muted text-xs">Revisado</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PlaceFormModal
        abierto={enRevision !== null}
        titulo={enRevision ? `✅ REVISAR Y PUBLICAR: ${enRevision.nombre.toUpperCase()}` : ''}
        valoresIniciales={enRevision}
        textoGuardar="PUBLICAR EN VAMOS PUES"
        alGuardar={publicar}
        cerrar={() => setEnRevision(null)}
      />
    </div>
  );
}
