package com.example.VamosPues.service;

import com.example.VamosPues.dto.PlanGeneradoDTO;
import com.example.VamosPues.model.Lugar;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Lógica de "¿Qué hago hoy?": elige un lugar al azar cuyo precio no supere el presupuesto,
 * respetando la categoría elegida y la regla de +18. Si no hay ninguno, sugiere las 3
 * opciones más baratas que se pasan del presupuesto.
 */
@Service
public class GeneradorPlanService {

    private final LugarService lugarService;

    public GeneradorPlanService(LugarService lugarService) {
        this.lugarService = lugarService;
    }

    public PlanGeneradoDTO generar(int presupuesto, String categoria, boolean incluirMayoresDeEdad, Long excluirId) {
        List<Lugar> todos = lugarService.obtenerTodos();
        int maximo = Math.max(presupuesto, 0);

        List<Lugar> candidatos = todos.stream()
                .filter(l -> precio(l) <= maximo)
                .filter(l -> incluirMayoresDeEdad || !Boolean.TRUE.equals(l.getMayorDeEdad()))
                .filter(l -> coincideCategoria(l, categoria))
                .toList();

        if (!candidatos.isEmpty()) {
            // Evitar repetir el mismo plan dos veces seguidas cuando hay más opciones
            List<Lugar> opciones = candidatos;
            if (candidatos.size() > 1 && excluirId != null) {
                List<Lugar> sinRepetir = candidatos.stream().filter(l -> !l.getId().equals(excluirId)).toList();
                if (!sinRepetir.isEmpty()) opciones = sinRepetir;
            }
            Lugar elegido = opciones.get(ThreadLocalRandom.current().nextInt(opciones.size()));
            return new PlanGeneradoDTO(true, elegido, candidatos.size(), List.of(), maximo, 0);
        }

        List<Lugar> alternativas = todos.stream()
                .filter(l -> precio(l) > maximo)
                .filter(l -> incluirMayoresDeEdad || !Boolean.TRUE.equals(l.getMayorDeEdad()))
                .filter(l -> coincideCategoria(l, categoria))
                .sorted(Comparator.comparingInt(GeneradorPlanService::precio))
                .limit(3)
                .toList();

        int diferencia = alternativas.isEmpty() ? 20000 : precio(alternativas.get(0)) - maximo;
        return new PlanGeneradoDTO(false, null, 0, alternativas, maximo, Math.max(diferencia, 5000));
    }

    private static int precio(Lugar lugar) {
        return lugar.getPrecio() == null ? 0 : lugar.getPrecio();
    }

    private static boolean coincideCategoria(Lugar lugar, String categoria) {
        if (categoria == null || categoria.isBlank() || categoria.equalsIgnoreCase("todas")) return true;
        return categoria.equalsIgnoreCase(lugar.getCategoria());
    }
}
