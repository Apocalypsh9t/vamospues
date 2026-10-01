package com.example.VamosPues.controller;

import com.example.VamosPues.dto.EncuestaRequestDTO;
import com.example.VamosPues.model.Encuesta;
import com.example.VamosPues.service.EncuestaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encuestas")
public class EncuestaController {

    private final EncuestaService encuestaService;

    public EncuestaController(EncuestaService encuestaService) {
        this.encuestaService = encuestaService;
    }

    @GetMapping
    public ResponseEntity<List<Encuesta>> obtenerTodas() {
        return ResponseEntity.ok(encuestaService.obtenerTodas());
    }

    @PostMapping
    public ResponseEntity<Encuesta> crear(@RequestBody EncuestaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(encuestaService.crear(dto));
    }
}
