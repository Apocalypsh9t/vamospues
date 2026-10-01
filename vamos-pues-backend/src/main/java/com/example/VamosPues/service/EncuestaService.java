package com.example.VamosPues.service;

import com.example.VamosPues.dto.EncuestaRequestDTO;
import com.example.VamosPues.model.Encuesta;
import com.example.VamosPues.repository.EncuestaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class EncuestaService {

    private final EncuestaRepository encuestaRepository;

    public EncuestaService(EncuestaRepository encuestaRepository) {
        this.encuestaRepository = encuestaRepository;
    }

    public List<Encuesta> obtenerTodas() {
        return encuestaRepository.findAllByOrderByFechaCreacionDesc();
    }

    @Transactional
    public Encuesta crear(EncuestaRequestDTO dto) {
        Encuesta e = new Encuesta();
        e.setEncontroFacil(Boolean.TRUE.equals(dto.getEncontroFacil()));
        e.setVolveriaAUsar(Boolean.TRUE.equals(dto.getVolveriaAUsar()));
        e.setSugerencia(dto.getSugerencia() == null ? "" : dto.getSugerencia().trim());
        e.setFechaCreacion(Instant.now());
        return encuestaRepository.save(e);
    }
}
