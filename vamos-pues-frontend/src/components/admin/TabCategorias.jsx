import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import api, { esSesionExpirada } from '../../services/api';

export default function TabCategorias({ manejarError }) {
  const { categorias, recargarDatos } = useApp();
  const [nombre, setNombre] = useState('');
  const [icono, setIcono] = useState('📍');
  const [color, setColor] = useState('#FE8616');

  const crear = async () => {
    if (!nombre.trim()) {
      alert('Ingresa el nombre de la categoría.');
      return;
    }
    try {
      const { data } = await api.post('/categorias', { nombre: nombre.trim(), icono, color });
      alert(`Categoría "${data.nombre}" creada.`);
      setNombre('');
      await recargarDatos();
    } catch (err) {
      if (err?.response?.status === 409 && !esSesionExpirada(err)) {
        alert('Esta categoría ya existe.');
      } else {
        manejarError(err, 'No se pudo crear la categoría.');
      }
    }
  };

  return (
    <div id="admin-tab-content-categories">
      <h3 className="mb-3">Categorías Registradas</h3>
      <div className="d-flex gap-2 wrap mb-4 align-center">
        <input type="text" id="new-cat-name" className="input-custom" placeholder="Nombre nueva categoría..." value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input type="text" id="new-cat-icon" className="input-custom" style={{ width: '70px', textAlign: 'center' }} placeholder="Emoji" value={icono} onChange={(e) => setIcono(e.target.value)} />
        <input type="color" id="new-cat-color" value={color} onChange={(e) => setColor(e.target.value)} style={{ height: '42px', border: 'var(--border-thick)', borderRadius: '4px', cursor: 'pointer' }} />
        <button className="btn btn-primary" onClick={crear}>
          + Agregar Categoría
        </button>
      </div>
      <div id="admin-categories-list" className="d-flex gap-3 wrap">
        {categorias.map((c) => (
          <div key={c.id} className="admin-category-card" style={{ borderLeft: `6px solid ${c.color}` }}>
            <span className="cat-icon">{c.icono}</span>
            <div>
              <h4 className="font-bold">{c.nombre}</h4>
              <span className="text-xs text-muted">ID: {c.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
