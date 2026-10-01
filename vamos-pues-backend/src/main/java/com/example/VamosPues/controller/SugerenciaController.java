package com.example.VamosPues.controller;

import com.example.VamosPues.dto.LugarRequestDTO;
import com.example.VamosPues.dto.SugerenciaRequestDTO;
import com.example.VamosPues.model.Lugar;
import com.example.VamosPues.model.Sugerencia;
import com.example.VamosPues.service.SugerenciaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sugerencias")
public class SugerenciaController {

    private final SugerenciaService sugerenciaService;

    public SugerenciaController(SugerenciaService sugerenciaService) {
        this.sugerenciaService = sugerenciaService;
    }

    @GetMapping
    public ResponseEntity<List<Sugerencia>> obtenerTodas() {
        return ResponseEntity.ok(sugerenciaService.obtenerTodas());
    }

    @PostMapping
    public ResponseEntity<Sugerencia> crear(@Valid @RequestBody SugerenciaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sugerenciaService.crear(dto));
    }

    // El cuerpo es opcional: trae los datos corregidos por el admin antes de publicar
    @PutMapping("/{id}/aprobar")
    public ResponseEntity<Lugar> aprobar(@PathVariable Long id,
                                         @Valid @RequestBody(required = false) LugarRequestDTO datosRevisados) {
        return ResponseEntity.ok(sugerenciaService.aprobar(id, datosRevisados));
    }

    @PutMapping("/{id}/rechazar")
    public ResponseEntity<Sugerencia> rechazar(@PathVariable Long id) {
        return ResponseEntity.ok(sugerenciaService.rechazar(id));
    }
}
