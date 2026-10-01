package com.example.VamosPues.dto;

import com.example.VamosPues.model.Lugar;

import java.util.List;

/**
 * Resultado de "¿Qué hago hoy?": si exito es true viene el plan elegido; si no, vienen
 * hasta 3 alternativas un poco más caras y cuánto dinero extra se necesitaría.
 */
public record PlanGeneradoDTO(
        boolean exito,
        Lugar plan,
        int totalEncontrados,
        List<Lugar> alternativas,
        int presupuesto,
        int diferenciaMasCercana
) {
}
