package com.example.VamosPues.service;

import com.example.VamosPues.dto.LugarRequestDTO;
import com.example.VamosPues.exception.RecursoNoEncontradoException;
import com.example.VamosPues.model.Lugar;
import com.example.VamosPues.repository.LugarRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.NumberFormat;
import java.time.Instant;
import java.util.List;
import java.util.Locale;

@Service
public class LugarService {

    public static final double LATITUD_POR_DEFECTO = 6.2442;
    public static final double LONGITUD_POR_DEFECTO = -75.5812;
    public static final String IMAGEN_POR_DEFECTO =
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";

    private final LugarRepository lugarRepository;

    public LugarService(LugarRepository lugarRepository) {
        this.lugarRepository = lugarRepository;
    }

    public List<Lugar> obtenerTodos() {
        return lugarRepository.findAllByOrderByFechaCreacionDesc();
    }

    public Lugar obtenerPorId(Long id) {
        return lugarRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Lugar no encontrado con id " + id));
    }

    // Al crear, los campos vacíos se llenan con textos por defecto para que la ficha
    // del lugar nunca quede con huecos.
    @Transactional
    public Lugar crear(LugarRequestDTO dto) {
        Lugar lugar = new Lugar();
        lugar.setNombre(dto.getNombre().trim());
        lugar.setCategoria(conDefecto(dto.getCategoria(), "Cultura"));
        lugar.setDescripcion(conDefecto(dto.getDescripcion(), "Sin descripción detallada."));
        lugar.setDireccion(conDefecto(dto.getDireccion(), "Área Metropolitana del Valle de Aburrá"));
        lugar.setMunicipio(conDefecto(dto.getMunicipio(), "Medellín"));
        lugar.setZona(lugar.getMunicipio());
        lugar.setHorario(conDefecto(dto.getHorario(), "Consultar horarios en redes oficiales"));
        lugar.setComoLlegar(conDefecto(dto.getComoLlegar(), "Información no disponible"));
        aplicarCamposComunes(dto, lugar);
        lugar.setFechaCreacion(Instant.now());
        return lugarRepository.save(lugar);
    }

    @Transactional
    public Lugar actualizar(Long id, LugarRequestDTO dto) {
        Lugar lugar = obtenerPorId(id);
        lugar.setNombre(dto.getNombre().trim());
        lugar.setCategoria(conDefecto(dto.getCategoria(), lugar.getCategoria()));
        lugar.setMunicipio(conDefecto(dto.getMunicipio(), lugar.getMunicipio()));
        lugar.setDescripcion(limpiar(dto.getDescripcion()));
        lugar.setDireccion(limpiar(dto.getDireccion()));
        lugar.setHorario(limpiar(dto.getHorario()));
        lugar.setComoLlegar(limpiar(dto.getComoLlegar()));
        aplicarCamposComunes(dto, lugar);
        return lugarRepository.save(lugar);
    }

    @Transactional
    public void eliminar(Long id) {
        lugarRepository.delete(obtenerPorId(id));
    }

    private void aplicarCamposComunes(LugarRequestDTO dto, Lugar lugar) {
        int precio = dto.getPrecio() == null ? 0 : dto.getPrecio();
        lugar.setPrecio(precio);
        lugar.setPrecioFormateado(conDefecto(dto.getPrecioFormateado(), formatearPrecio(precio)));
        lugar.setSitioWeb(limpiar(dto.getSitioWeb()));
        lugar.setInstagram(limpiar(dto.getInstagram()));
        lugar.setImagen(conDefecto(dto.getImagen(), IMAGEN_POR_DEFECTO));
        lugar.setMayorDeEdad(Boolean.TRUE.equals(dto.getMayorDeEdad()));
        lugar.setEsEvento(Boolean.TRUE.equals(dto.getEsEvento()));
        lugar.setLatitud(dto.getLatitud() != null ? dto.getLatitud() : LATITUD_POR_DEFECTO);
        lugar.setLongitud(dto.getLongitud() != null ? dto.getLongitud() : LONGITUD_POR_DEFECTO);
    }

    /** Ej: 0 → "Gratis ($0)", 15000 → "$15.000 COP". */
    public static String formatearPrecio(int precio) {
        if (precio == 0) return "Gratis ($0)";
        return "$" + NumberFormat.getIntegerInstance(Locale.forLanguageTag("es-CO")).format(precio) + " COP";
    }

    private static String limpiar(String valor) {
        return valor == null ? "" : valor.trim();
    }

    private static String conDefecto(String valor, String porDefecto) {
        return (valor == null || valor.isBlank()) ? porDefecto : valor.trim();
    }
}
