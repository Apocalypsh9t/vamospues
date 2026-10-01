import { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { esRespaldoAntiguo, prepararMigracion } from '../../utils/respaldoAntiguo';

export default function TabRespaldo({ manejarError, alImportar }) {
  const { lugares, recargarDatos } = useApp();
  const archivoRef = useRef(null);

  const descargar = async () => {
    try {
      const { data } = await api.get('/admin/respaldo');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vamos_pues_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      manejarError(err, 'No se pudo descargar la copia de seguridad.');
    }
  };

  const importar = async () => {
    const archivo = archivoRef.current?.files[0];
    if (!archivo) return;
    let datos;
    try {
      datos = JSON.parse(await archivo.text());
    } catch {
      alert('Error importando el archivo: no es un JSON válido.');
      return;
    }
    if (esRespaldoAntiguo(datos)) {
      await migrarRespaldoAntiguo(datos);
      return;
    }
    try {
      await api.post('/admin/respaldo', datos);
      alert('🎉 ¡Base de datos importada exitosamente!');
      await recargarDatos();
      alImportar();
    } catch (err) {
      manejarError(err, 'Error importando el archivo.');
    }
  };

  // Respaldo de la versión anterior: se AGREGA lo que falta, sin reemplazar ni borrar nada
  const migrarRespaldoAntiguo = async (datos) => {
    try {
      const { data: encuestasActuales } = await api.get('/encuestas');
      const { lugares: nuevos, sugerencias, encuestas } = prepararMigracion(datos, lugares, encuestasActuales);
      if (nuevos.length + sugerencias.length + encuestas.length === 0) {
        alert('✅ Este respaldo de la versión anterior no tiene nada nuevo: todos sus lugares ya están en Vamos Pues.');
        return;
      }
      const resumen = `Este archivo es de la versión anterior de Vamos Pues. Se agregará lo que falta, sin borrar nada:\n\n` +
        `• ${nuevos.length} lugar(es) que no existen todavía\n• ${sugerencias.length} sugerencia(s) pendiente(s)\n• ${encuestas.length} respuesta(s) de encuesta\n\n¿Continuar?`;
      if (!confirm(resumen)) return;

      for (const lugar of nuevos) await api.post('/lugares', lugar);
      for (const sugerencia of sugerencias) await api.post('/sugerencias', sugerencia);
      for (const encuesta of encuestas) await api.post('/encuestas', encuesta);

      alert(`🎉 ¡Migración completa! Se agregaron ${nuevos.length} lugar(es), ${sugerencias.length} sugerencia(s) y ${encuestas.length} encuesta(s).`);
      await recargarDatos();
      alImportar();
    } catch (err) {
      manejarError(err, 'Error migrando el respaldo de la versión anterior.');
    }
  };

  const restablecer = async () => {
    if (!confirm('⚠️ ¿Estás seguro de restablecer toda la base de datos a los 129 lugares originales verificados de Vamos Pues? Se borrarán modificaciones locales.')) return;
    try {
      await api.post('/admin/restablecer');
      alert('Base de datos restablecida a los valores oficiales.');
      await recargarDatos();
    } catch (err) {
      manejarError(err, 'No se pudo restablecer la base de datos.');
    }
  };

  return (
    <div id="admin-tab-content-backup">
      <h3 className="mb-3">Exportar, Importar y Respaldo de Datos</h3>
      <p className="text-muted mb-4">Puedes descargar toda la base de datos de Vamos Pues en formato JSON para tener un respaldo seguro o trasladarla a un servidor backend en el futuro.</p>

      <div className="d-flex gap-3 wrap">
        <div className="filters-panel" style={{ flex: 1, minWidth: '280px' }}>
          <h4>📤 Exportar Base de Datos</h4>
          <p className="text-muted text-xs mt-1 mb-3">Descarga todos los lugares, categorías, sugerencias y encuestas en un archivo JSON.</p>
          <button className="btn btn-primary" onClick={descargar}>
            DESCARGAR JSON (BACKUP)
          </button>
        </div>

        <div className="filters-panel" style={{ flex: 1, minWidth: '280px' }}>
          <h4>📥 Importar Base de Datos</h4>
          <p className="text-muted text-xs mt-1 mb-3">Carga un archivo JSON de respaldo para restaurar datos completos. También acepta respaldos de la versión anterior (solo agrega lo que falte).</p>
          <input type="file" ref={archivoRef} id="admin-import-file" accept=".json" className="input-custom mb-3" style={{ width: '100%' }} />
          <button className="btn btn-secondary" onClick={importar}>
            CARGAR ARCHIVO JSON
          </button>
        </div>

        <div className="filters-panel" style={{ flex: 1, minWidth: '280px' }}>
          <h4>⚠️ Restablecer Valores Oficiales</h4>
          <p className="text-muted text-xs mt-1 mb-3">Restaura la plataforma a los 129 lugares originales verificados de Vamos Pues.</p>
          <button className="btn btn-accent btn-sm" onClick={restablecer}>
            RESTAURAR A DATOS OFICIALES
          </button>
        </div>
      </div>
    </div>
  );
}
