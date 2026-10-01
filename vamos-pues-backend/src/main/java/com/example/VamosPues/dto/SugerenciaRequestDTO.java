package com.example.VamosPues.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class SugerenciaRequestDTO {

    @NotBlank(message = "Por favor escribe el nombre del lugar.")
    private String nombre;

    private String categoria;
    private String municipio;
    private String direccion;

    @PositiveOrZero(message = "El precio no puede ser negativo.")
    private Integer precio;

    private String horario;
    private String descripcion;
    private String comoLlegar;
    private String sitioWeb;
    private String informacionAdicional;
    private String imagen;
    private Boolean mayorDeEdad;
}
