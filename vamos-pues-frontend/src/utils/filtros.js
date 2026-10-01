import { PRECIO_SIN_LIMITE } from './constantes';

/** Minúsculas y sin tildes: así "medellin" encuentra "Medellín" y "cafe" encuentra "Café". */
export const normalizar = (texto) =>
  (texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const contiene = (texto, termino) => normalizar(texto).includes(termino);

/** Coincidencia usada por el autocompletado del buscador principal (termino ya normalizado). */
export function coincideBusquedaRapida(lugar, termino) {
  return contiene(lugar.nombre, termino) ||
    contiene(lugar.categoria, termino) ||
    contiene(lugar.municipio, termino) ||
    contiene(lugar.zona, termino) ||
    contiene(lugar.descripcion, termino);
}

/** Aplica todos los filtros de la sección Explorar (también los usa el mapa). */
export function filtrarLugares(lugares, filtros, favoritos = []) {
  let resultado = [...lugares];

  if (filtros.busqueda) {
    const q = normalizar(filtros.busqueda.trim());
    resultado = resultado.filter((l) => coincideBusquedaRapida(l, q) || contiene(l.direccion, q));
  }

  // Regla estricta de precio: precio <= presupuesto máximo
  if (filtros.precioMaximo < PRECIO_SIN_LIMITE) {
    resultado = resultado.filter((l) => (Number(l.precio) || 0) <= filtros.precioMaximo);
  }

  // Multi-selección de categorías: basta con cumplir cualquiera de las elegidas
  if (filtros.categorias.length > 0) {
    resultado = resultado.filter((l) =>
      filtros.categorias.some((c) => normalizar(c) === normalizar(l.categoria)));
  }

  if (filtros.municipio && filtros.municipio !== 'Todos') {
    resultado = resultado.filter((l) => normalizar(l.municipio) === normalizar(filtros.municipio));
  }

  if (filtros.edad === 'no_adult') {
    resultado = resultado.filter((l) => !l.mayorDeEdad);
  } else if (filtros.edad === 'only_adult') {
    resultado = resultado.filter((l) => l.mayorDeEdad);
  }

  if (filtros.soloFavoritos) {
    resultado = resultado.filter((l) => favoritos.includes(l.id));
  }

  if (filtros.orden === 'price_asc') {
    resultado.sort((a, b) => (Number(a.precio) || 0) - (Number(b.precio) || 0));
  } else if (filtros.orden === 'price_desc') {
    resultado.sort((a, b) => (Number(b.precio) || 0) - (Number(a.precio) || 0));
  } else if (filtros.orden === 'name') {
    resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  return resultado;
}
