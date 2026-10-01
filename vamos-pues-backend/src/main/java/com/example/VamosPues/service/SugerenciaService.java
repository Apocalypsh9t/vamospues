package com.example.VamosPues.service;

import com.example.VamosPues.dto.LugarRequestDTO;
import com.example.VamosPues.dto.SugerenciaRequestDTO;
import com.example.VamosPues.exception.RecursoNoEncontradoException;
import com.example.VamosPues.model.Lugar;
import com.example.VamosPues.model.Sugerencia;
import com.example.VamosPues.repository.SugerenciaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class SugerenciaService {

    private final SugerenciaRepository sugerenciaRepository;
    private final LugarService lugarService;

    public SugerenciaService(SugerenciaRepository sugerenciaRepository, LugarService lugarService) {
        this.sugerenciaRepository = sugerenciaRepository;
        this.lugarService = lugarService;
    }

    public List<Sugerencia> obtenerTodas() {
        return sugerenciaRepository.findAllByOrderByFechaCreacionDesc();
    }

    // Toda sugerencia entra como "pendiente" hasta que un administrador la revise
    @Transactional
    public Sugerencia crear(SugerenciaRequestDTO dto) {
        Sugerencia s = new Sugerencia();
        s.setNombre(dto.getNombre().trim());
        s.setCategoria(conDefecto(dto.getCategoria(), "Cultura"));
        s.setMunicipio(conDefecto(dto.getMunicipio(), "Medellín"));
        s.setDescripcion(limpiar(dto.getDescripcion()));
        s.setDireccion(limpiar(dto.getDireccion()));
        s.setHorario(limpiar(dto.getHorario()));
        s.setPrecio(dto.getPrecio() == null ? 0 : dto.getPrecio());
        s.setComoLlegar(limpiar(dto.getComoLlegar()));
        s.setSitioWeb(limpiar(dto.getSitioWeb()));
        s.setInformacionAdicional(limpiar(dto.getInformacionAdicional()));
        s.setMayorDeEdad(Boolean.TRUE.equals(dto.getMayorDeEdad()));
        s.setImagen(limpiar(dto.getImagen()));
        s.setEstado(Sugerencia.PENDIENTE);
        s.setFechaCreacion(Instant.now());
        return sugerenciaRepository.save(s);
    }

    /**
     * Convierte la sugerencia en un lugar público y la marca como aprobada. Si el admin
     * revisó y corrigió los datos (ubicación, precio, etc.) llegan en datosRevisados;
     * si no, se publican tal como los envió el usuario.
     */
    @Transactional
    public Lugar aprobar(Long id, LugarRequestDTO datosRevisados) {
        Sugerencia s = buscarPorId(id);
        if (!Sugerencia.PENDIENTE.equals(s.getEstado())) {
            throw new IllegalArgumentException("Esta sugerencia ya fue revisada.");
        }

        LugarRequestDTO datos = datosRevisados != null ? datosRevisados : datosDesde(s);
        Lugar nuevo = lugarService.crear(datos);
        s.setEstado(Sugerencia.APROBADA);
        s.setLugarCreadoId(nuevo.getId());
        sugerenciaRepository.save(s);
        return nuevo;
    }

    private LugarRequestDTO datosDesde(Sugerencia s) {
        LugarRequestDTO datos = new LugarRequestDTO();
        datos.setNombre(s.getNombre());
        datos.setCategoria(s.getCategoria());
        datos.setDescripcion(s.getDescripcion());
        datos.setDireccion(s.getDireccion());
        datos.setMunicipio(s.getMunicipio());
        datos.setHorario(s.getHorario());
        datos.setPrecio(s.getPrecio());
        datos.setComoLlegar(s.getComoLlegar());
        datos.setSitioWeb(s.getSitioWeb());
        datos.setInstagram(s.getInstagram());
        datos.setMayorDeEdad(s.getMayorDeEdad());
        datos.setImagen(s.getImagen());
        return datos;
    }

    @Transactional
    public Sugerencia rechazar(Long id) {
        Sugerencia s = buscarPorId(id);
        s.setEstado(Sugerencia.RECHAZADA);
        return sugerenciaRepository.save(s);
    }

    private Sugerencia buscarPorId(Long id) {
        return sugerenciaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Sugerencia no encontrada con id " + id));
    }

    private static String limpiar(String valor) {
        return valor == null ? "" : valor.trim();
    }

    private static String conDefecto(String valor, String porDefecto) {
        return (valor == null || valor.isBlank()) ? porDefecto : valor.trim();
    }
}
