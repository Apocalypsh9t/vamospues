package com.example.VamosPues.config;

import com.example.VamosPues.service.RespaldoService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/** Al arrancar, si la base de datos está vacía, carga los lugares y categorías oficiales. */
@Component
public class CargaDatosIniciales implements CommandLineRunner {

    private final RespaldoService respaldoService;

    public CargaDatosIniciales(RespaldoService respaldoService) {
        this.respaldoService = respaldoService;
    }

    @Override
    public void run(String... args) {
        respaldoService.cargarDatosInicialesSiHaceFalta();
    }
}
