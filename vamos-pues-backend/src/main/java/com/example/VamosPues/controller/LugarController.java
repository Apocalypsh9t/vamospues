package com.example.VamosPues.controller;

import com.example.VamosPues.dto.LugarRequestDTO;
import com.example.VamosPues.dto.MensajeDTO;
import com.example.VamosPues.dto.PlanGeneradoDTO;
import com.example.VamosPues.model.Lugar;
import com.example.VamosPues.service.GeneradorPlanService;
import com.example.VamosPues.service.LugarService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lugares")
public class LugarController {

    private final LugarService lugarService;
    private final GeneradorPlanService generadorPlanService;

    public LugarController(LugarService lugarService, GeneradorPlanService generadorPlanService) {
        this.lugarService = lugarService;
        this.generadorPlanService = generadorPlanService;
    }

    @GetMapping
    public ResponseEntity<List<Lugar>> obtenerTodos() {
        return ResponseEntity.ok(lugarService.obtenerTodos());
    }

    // "¿Qué hago hoy?" — debe ir antes de /{id} para que "generar" no se lea como un id
    @GetMapping("/generar")
    public ResponseEntity<PlanGeneradoDTO> generarPlan(
            @RequestParam(defaultValue = "0") int presupuesto,
            @RequestParam(defaultValue = "todas") String categoria,
            @RequestParam(defaultValue = "false") boolean incluirMayoresDeEdad,
            @RequestParam(required = false) Long excluirId) {
        return ResponseEntity.ok(generadorPlanService.generar(presupuesto, categoria, incluirMayoresDeEdad, excluirId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lugar> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(lugarService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Lugar> crear(@Valid @RequestBody LugarRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lugarService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lugar> actualizar(@PathVariable Long id, @Valid @RequestBody LugarRequestDTO dto) {
        return ResponseEntity.ok(lugarService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeDTO> eliminar(@PathVariable Long id) {
        lugarService.eliminar(id);
        return ResponseEntity.ok(new MensajeDTO("Lugar eliminado"));
    }
}
