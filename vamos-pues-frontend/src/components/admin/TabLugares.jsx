import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { usarImagenRespaldo } from '../../utils/constantes';
import { normalizar } from '../../utils/filtros';
import PlaceFormModal from './PlaceFormModal';

export default function TabLugares({ manejarError }) {
  const { lugares, categorias, recargarDatos } = useApp();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  // null = modal cerrado, 'nuevo' = crear, o el lugar que se está editando
  const [enEdicion, setEnEdicion] = useState(null);

  const termino = normalizar(busqueda.trim());
  const filtrados = lugares
    .filter((l) => !termino ||
      normalizar(l.nombre).includes(termino) ||
      normalizar(l.direccion).includes(termino) ||
      normalizar(l.municipio).includes(termino))
    .filter((l) => categoriaFiltro === 'todas' || normalizar(l.categoria) === normalizar(categoriaFiltro));

  const lugarEditado = enEdicion === 'nuevo' ? null : enEdicion;

  const guardar = async (datos) => {
    try {
      if (lugarEditado) {
        await api.put(`/lugares/${lugarEditado.id}`, datos);
        alert(`✅ ¡Lugar "${datos.nombre}" actualizado exitosamente!`);
      } else {
        await api.post('/lugares', datos);
        alert(`🎉 ¡Lugar "${datos.nombre}" agregado exitosamente a Vamos Pues!`);
      }
      await recargarDatos();
      setEnEdicion(null);
    } catch (err) {
      manejarError(err, 'No se pudo guardar el lugar.');
    }
  };

  const eliminar = async (lugar) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente "${lugar.nombre}" de la plataforma?`)) return;
    try {
      await api.delete(`/lugares/${lugar.id}`);
      await recargarDatos();
    } catch (err) {
      manejarError(err, 'No se pudo eliminar el lugar.');
    }
  };

  return (
    <div id="admin-tab-content-places">
      <div className="d-flex justify-between align-center wrap gap-2 mb-3">
        <div className="d-flex gap-2 wrap align-center">
          <input type="text" id="admin-places-search" className="input-custom" placeholder="Buscar lugar en el panel..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <select id="admin-places-cat-filter" className="select-custom" value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
            <option value="todas">Todas las categorías</option>
            {categorias.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </select>
          <span id="admin-places-count" className="font-bold text-muted text-xs">{filtrados.length} lugares registrados</span>
        </div>
        <button className="btn btn-primary" onClick={() => setEnEdicion('nuevo')}>
          ➕ AGREGAR NUEVO LUGAR
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Lugar</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Edad</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="admin-places-table-body">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No se encontraron lugares con estos filtros.
                </td>
              </tr>
            ) : filtrados.map((lugar, idx) => (
              <tr key={lugar.id}>
                <td><strong>#{idx + 1}</strong></td>
                <td>
                  <div className="d-flex align-center gap-2">
                    <img src={lugar.imagen} alt={lugar.nombre} className="admin-place-thumb" onError={usarImagenRespaldo} />
                    <div>
                      <div className="font-bold">{lugar.nombre}</div>
                      <small className="text-muted">{lugar.municipio} · {lugar.direccion}</small>
                    </div>
                  </div>
                </td>
                <td><span className="badge-tag">{lugar.categoria}</span></td>
                <td><strong>{Number(lugar.precio) === 0 ? 'Gratis' : lugar.precioFormateado}</strong></td>
                <td>{lugar.mayorDeEdad ? <span className="badge-tag adult-tag">🔞 +18</span> : <span className="text-muted">Familiar / Todos</span>}</td>
                <td>{lugar.esEvento ? <span className="badge-tag" style={{ background: '#7B46F8', color: '#fff' }}>🎪 Evento</span> : <span className="text-muted">Permanente</span>}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-edit" onClick={() => setEnEdicion(lugar)}>
                      ✏️ Editar
                    </button>
                    <button className="btn btn-sm btn-delete" onClick={() => eliminar(lugar)}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PlaceFormModal
        abierto={enEdicion !== null}
        titulo={lugarEditado ? `✏️ EDITAR LUGAR: ${lugarEditado.nombre.toUpperCase()}` : '➕ AGREGAR NUEVO LUGAR O EVENTO'}
        valoresIniciales={lugarEditado}
        textoGuardar="GUARDAR LUGAR EN LA BASE DE DATOS"
        alGuardar={guardar}
        cerrar={() => setEnEdicion(null)}
      />
    </div>
  );
}
