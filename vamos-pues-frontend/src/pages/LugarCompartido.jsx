import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Explorar from './Explorar';

/**
 * Enlace directo a un lugar (/lugar/15), el que se comparte por WhatsApp o en un QR:
 * muestra Explorar de fondo y abre la ficha del lugar encima.
 */
export default function LugarCompartido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lugares, cargado, abrirLugar } = useApp();

  useEffect(() => {
    if (!cargado) return;
    const lugarId = Number(id);
    if (lugares.some((l) => l.id === lugarId)) {
      abrirLugar(lugarId);
    } else {
      alert('😕 Este parche ya no está disponible en Vamos Pues.');
      navigate('/explorar', { replace: true });
    }
  }, [id, cargado, lugares, abrirLugar, navigate]);

  return <Explorar />;
}
