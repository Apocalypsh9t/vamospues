package com.example.VamosPues.service;

import com.example.VamosPues.dto.RespaldoDTO;
import com.example.VamosPues.model.Categoria;
import com.example.VamosPues.model.Encuesta;
import com.example.VamosPues.model.Lugar;
import com.example.VamosPues.model.Sugerencia;
import com.example.VamosPues.repository.CategoriaRepository;
import com.example.VamosPues.repository.EncuestaRepository;
import com.example.VamosPues.repository.LugarRepository;
import com.example.VamosPues.repository.SugerenciaRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

/**
 * Carga de los datos oficiales (129 lugares y 8 categorías), exportación/importación
 * de la base de datos completa en JSON y restablecimiento a los valores oficiales.
 */
@Service
public class RespaldoService {

    private final LugarRepository lugarRepository;
    private final CategoriaRepository categoriaRepository;
    private final SugerenciaRepository sugerenciaRepository;
    private final EncuestaRepository encuestaRepository;
    private final JsonMapper jsonMapper = JsonMapper.builder().build();

    public RespaldoService(LugarRepository lugarRepository, CategoriaRepository categoriaRepository,
                           SugerenciaRepository sugerenciaRepository, EncuestaRepository encuestaRepository) {
        this.lugarRepository = lugarRepository;
        this.categoriaRepository = categoriaRepository;
        this.sugerenciaRepository = sugerenciaRepository;
        this.encuestaRepository = encuestaRepository;
    }

    /** Solo la primera vez que arranca el backend (base de datos vacía). */
    @Transactional
    public void cargarDatosInicialesSiHaceFalta() {
        if (lugarRepository.count() > 0 || categoriaRepository.count() > 0) return;
        guardarLugares(leerJson("datos/lugares.json", Lugar[].class));
        guardarCategorias(leerJson("datos/categorias.json", Categoria[].class));
        sugerenciaRepository.save(sugerenciaDeDemostracion());
    }

    public RespaldoDTO exportar() {
        return new RespaldoDTO("Vamos Pues", "2.0.0", Instant.now(),
                lugarRepository.findAllByOrderByFechaCreacionDesc(),
                categoriaRepository.findAllByOrderByOrdenAsc(),
                sugerenciaRepository.findAllByOrderByFechaCreacionDesc(),
                encuestaRepository.findAllByOrderByFechaCreacionDesc());
    }

    @Transactional
    public void importar(RespaldoDTO respaldo) {
        if (respaldo == null || respaldo.getLugares() == null) {
            throw new IllegalArgumentException("El archivo no contiene un arreglo válido de lugares.");
        }
        lugarRepository.deleteAllInBatch();
        guardarLugares(respaldo.getLugares());

        if (respaldo.getCategorias() != null) {
            categoriaRepository.deleteAllInBatch();
            guardarCategorias(respaldo.getCategorias());
        }
        if (respaldo.getSugerencias() != null) {
            sugerenciaRepository.deleteAllInBatch();
            respaldo.getSugerencias().forEach(s -> {
                s.setId(null);
                if (s.getFechaCreacion() == null) s.setFechaCreacion(Instant.now());
            });
            sugerenciaRepository.saveAll(respaldo.getSugerencias());
        }
        if (respaldo.getEncuestas() != null) {
            encuestaRepository.deleteAllInBatch();
            respaldo.getEncuestas().forEach(e -> {
                e.setId(null);
                if (e.getFechaCreacion() == null) e.setFechaCreacion(Instant.now());
            });
            encuestaRepository.saveAll(respaldo.getEncuestas());
        }
    }

    /** Vuelve a los lugares y categorías oficiales; sugerencias y encuestas se conservan. */
    @Transactional
    public void restablecer() {
        lugarRepository.deleteAllInBatch();
        categoriaRepository.deleteAllInBatch();
        guardarLugares(leerJson("datos/lugares.json", Lugar[].class));
        guardarCategorias(leerJson("datos/categorias.json", Categoria[].class));
    }

    // La lista llega en el orden en que se debe mostrar: se asignan fechas descendentes
    // para que el listado (ordenado por fecha, más reciente primero) conserve ese orden.
    private void guardarLugares(List<Lugar> lugares) {
        Instant base = Instant.now();
        for (int i = 0; i < lugares.size(); i++) {
            Lugar lugar = lugares.get(i);
            lugar.setId(null);
            lugar.setFechaCreacion(base.minusSeconds(i));
        }
        lugarRepository.saveAll(lugares);
    }

    private void guardarCategorias(List<Categoria> categorias) {
        for (int i = 0; i < categorias.size(); i++) {
            categorias.get(i).setOrden(i + 1);
        }
        categoriaRepository.saveAll(categorias);
    }

    private <T> List<T> leerJson(String ruta, Class<T[]> tipo) {
        try (InputStream in = new ClassPathResource(ruta).getInputStream()) {
            return Arrays.asList(jsonMapper.readValue(in, tipo));
        } catch (IOException ex) {
            throw new UncheckedIOException("No se pudo leer " + ruta, ex);
        }
    }

    private Sugerencia sugerenciaDeDemostracion() {
        Sugerencia s = new Sugerencia();
        s.setNombre("Parque Ambiental La Frontera");
        s.setCategoria("Naturaleza");
        s.setDescripcion("Bosque de transición entre Medellín y Envigado con senderos y avistamiento de mariposas.");
        s.setDireccion("Calle 18 Sur con Carrera 43A, El Poblado / Envigado");
        s.setMunicipio("Medellín");
        s.setHorario("Lunes a domingo 6:00 a.m. a 6:00 p.m.");
        s.setPrecio(0);
        s.setComoLlegar("Metro Estación Ayurá, caminar 5 min al norte por la 43A.");
        s.setSitioWeb("https://www.medellin.gov.co");
        s.setInstagram("@medioambientemed");
        s.setInformacionAdicional("Recomendado para trotar y respirar aire fresco.");
        s.setMayorDeEdad(false);
        s.setImagen("");
        s.setEstado(Sugerencia.PENDIENTE);
        s.setFechaCreacion(Instant.now());
        return s;
    }
}
