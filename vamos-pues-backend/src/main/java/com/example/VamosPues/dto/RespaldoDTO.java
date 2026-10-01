package com.example.VamosPues.dto;

import com.example.VamosPues.model.Categoria;
import com.example.VamosPues.model.Encuesta;
import com.example.VamosPues.model.Lugar;
import com.example.VamosPues.model.Sugerencia;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/** Copia completa de la base de datos, usada para exportar e importar en JSON. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespaldoDTO {

    private String appName;
    private String version;
    private Instant exportedAt;
    private List<Lugar> lugares;
    private List<Categoria> categorias;
    private List<Sugerencia> sugerencias;
    private List<Encuesta> encuestas;
}
