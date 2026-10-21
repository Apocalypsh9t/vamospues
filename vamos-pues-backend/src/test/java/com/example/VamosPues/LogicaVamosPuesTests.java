package com.example.VamosPues;

import com.example.VamosPues.dto.LugarRequestDTO;
import com.example.VamosPues.dto.PlanGeneradoDTO;
import com.example.VamosPues.dto.SugerenciaRequestDTO;
import com.example.VamosPues.model.Lugar;
import com.example.VamosPues.model.Sugerencia;
import com.example.VamosPues.repository.SugerenciaRepository;
import com.example.VamosPues.service.GeneradorPlanService;
import com.example.VamosPues.service.LugarService;
import com.example.VamosPues.service.SugerenciaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/** Pruebas de la lógica principal sobre los 175 lugares oficiales (base de datos en memoria). */
@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:logica;DB_CLOSE_DELAY=-1")
class LogicaVamosPuesTests {

    @Autowired private GeneradorPlanService generador;
    @Autowired private LugarService lugarService;
    @Autowired private SugerenciaService sugerenciaService;
    @Autowired private SugerenciaRepository sugerenciaRepository;

    @Test
    void generadorRespetaPresupuestoYRegla18() {
        for (int i = 0; i < 50; i++) {
            PlanGeneradoDTO plan = generador.generar(20000, "todas", false, null);
            assertTrue(plan.exito());
            assertTrue(plan.plan().getPrecio() <= 20000, "El plan no puede pasarse del presupuesto");
            assertFalse(plan.plan().getMayorDeEdad(), "Sin marcar +18 no deben salir planes +18");
        }
    }

    @Test
    void generadorRespetaLaCategoria() {
        PlanGeneradoDTO plan = generador.generar(1_000_000, "Entretenimiento", true, null);
        assertTrue(plan.exito());
        assertEquals("Entretenimiento", plan.plan().getCategoria());
    }

    @Test
    void sinPlanesEnElPresupuestoSugiereAlternativasMasBaratasPrimero() {
        // Con $1.000 no hay "Planes al aire libre" (el más barato cuesta $15.000): deben salir
        // hasta 3 alternativas ordenadas de la más barata a la más cara
        PlanGeneradoDTO plan = generador.generar(1000, "Planes al aire libre", false, null);
        assertFalse(plan.exito());
        assertFalse(plan.alternativas().isEmpty());
        assertTrue(plan.alternativas().size() <= 3);
        for (int i = 1; i < plan.alternativas().size(); i++) {
            assertTrue(plan.alternativas().get(i - 1).getPrecio() <= plan.alternativas().get(i).getPrecio());
        }
        assertTrue(plan.diferenciaMasCercana() >= 5000);
    }

    @Test
    void formatoDePrecioColombiano() {
        assertEquals("Gratis ($0)", LugarService.formatearPrecio(0));
        assertEquals("$15.000 COP", LugarService.formatearPrecio(15000));
        assertEquals("$1.250.000 COP", LugarService.formatearPrecio(1250000));
    }

    @Test
    void editarUnLugarConservaElRangoDePrecioEscritoPorElAdmin() {
        LugarRequestDTO dto = new LugarRequestDTO();
        dto.setNombre("Lugar de prueba");
        dto.setPrecio(15000);
        dto.setPrecioFormateado("Entre $15.000 y $25.000 COP");
        Lugar creado = lugarService.crear(dto);
        assertEquals("Entre $15.000 y $25.000 COP", creado.getPrecioFormateado());

        dto.setDescripcion("Descripción corregida");
        Lugar editado = lugarService.actualizar(creado.getId(), dto);
        assertEquals("Entre $15.000 y $25.000 COP", editado.getPrecioFormateado());

        // Sin texto propio se arma solo a partir del número
        dto.setPrecioFormateado("");
        assertEquals("$15.000 COP", lugarService.actualizar(creado.getId(), dto).getPrecioFormateado());
        lugarService.eliminar(creado.getId());
    }

    @Test
    void aprobarSugerenciaUsaLosDatosRevisadosPorElAdmin() {
        SugerenciaRequestDTO nueva = new SugerenciaRequestDTO();
        nueva.setNombre("Mirador de prueba");
        Sugerencia sugerencia = sugerenciaService.crear(nueva);

        LugarRequestDTO revisado = new LugarRequestDTO();
        revisado.setNombre("Mirador de prueba (revisado)");
        revisado.setLatitud(6.30);
        revisado.setLongitud(-75.55);
        Lugar publicado = sugerenciaService.aprobar(sugerencia.getId(), revisado);

        assertEquals("Mirador de prueba (revisado)", publicado.getNombre());
        assertEquals(6.30, publicado.getLatitud());
        Sugerencia actualizada = sugerenciaRepository.findById(sugerencia.getId()).orElseThrow();
        assertEquals(Sugerencia.APROBADA, actualizada.getEstado());
        assertEquals(publicado.getId(), actualizada.getLugarCreadoId());

        // Una sugerencia ya revisada no se puede volver a publicar
        assertThrows(IllegalArgumentException.class, () -> sugerenciaService.aprobar(sugerencia.getId(), null));
        lugarService.eliminar(publicado.getId());
    }
}
