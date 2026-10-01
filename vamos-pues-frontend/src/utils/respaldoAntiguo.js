import { normalizar } from './filtros';

/**
 * Compatibilidad con los respaldos JSON de la versión anterior de Vamos Pues (la que
 * guardaba todo en el navegador). Esos archivos usan campos en inglés ("places", "name",
 * "isOver18"...) y se reconocen porque traen "places" en vez de "lugares".
 */
export const esRespaldoAntiguo = (datos) => Array.isArray(datos?.places) && !Array.isArray(datos?.lugares);

const lugarDesdeAntiguo = (p) => ({
  nombre: p.name,
  categoria: p.category,
  descripcion: p.description,
  direccion: p.address,
  municipio: p.municipality,
  precio: Number(p.price) || 0,
  precioFormateado: p.priceFormatted,
  horario: p.schedule,
  comoLlegar: p.howToGetThere,
  sitioWeb: p.website,
  instagram: p.instagram,
  imagen: p.image,
  mayorDeEdad: Boolean(p.isOver18),
  esEvento: Boolean(p.isEvent),
  latitud: p.coordinates?.lat,
  longitud: p.coordinates?.lng,
});

const sugerenciaDesdeAntigua = (s) => ({
  nombre: s.name,
  categoria: s.category,
  descripcion: s.description,
  direccion: s.address,
  municipio: s.municipality,
  precio: Number(s.price) || 0,
  horario: s.schedule,
  comoLlegar: s.howToGetThere,
  sitioWeb: s.website,
  informacionAdicional: s.additionalInfo,
  imagen: s.image,
  mayorDeEdad: Boolean(s.isOver18),
});

/**
 * Prepara la migración SIN borrar nada: solo toma los lugares que todavía no existen en la
 * plataforma (comparando nombres sin tildes ni mayúsculas, porque los 129 oficiales ya
 * están cargados y limpios), las sugerencias que seguían pendientes y las encuestas.
 */
export function prepararMigracion(datos, lugaresActuales, encuestasActuales = []) {
  const existentes = new Set(lugaresActuales.map((l) => normalizar(l.nombre).replace(/\s+/g, ' ').trim()));
  // Los 129 oficiales de la versión anterior tenían ids "lugar-12-..." (ya están cargados y
  // limpios aquí, aunque con el nombre corregido); los agregados por el admin tenían "place-...".
  const lugares = datos.places
    .filter((p) => p?.name && !String(p.id || '').startsWith('lugar-'))
    .filter((p) => !existentes.has(normalizar(p.name).replace(/\s+/g, ' ').trim()))
    .map(lugarDesdeAntiguo);
  const sugerencias = (datos.suggestions || [])
    .filter((s) => s?.name && (s.status || 'pendiente') === 'pendiente')
    .map(sugerenciaDesdeAntigua);
  // No repetir encuestas ya migradas (mismo comentario y respuestas)
  const firma = (e) => `${Boolean(e.encontroFacil)}|${Boolean(e.volveriaAUsar)}|${(e.sugerencia || '').trim()}`;
  const yaEstan = new Set(encuestasActuales.map(firma));
  const encuestas = (datos.surveys || [])
    .map((s) => ({ encontroFacil: Boolean(s.foundEasily), volveriaAUsar: Boolean(s.wouldUseAgain), sugerencia: s.suggestion || '' }))
    .filter((e) => !yaEstan.has(firma(e)));
  return { lugares, sugerencias, encuestas };
}
