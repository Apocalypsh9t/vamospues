package com.example.VamosPues.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class LugarRequestDTO {

    @NotBlank(message = "Por favor introduce el nombre del lugar.")
    private String nombre;

    private String categoria;
    private String municipio;
    private String direccion;

    @PositiveOrZero(message = "El precio no puede ser negativo.")
    private Integer precio;

    // Texto que ve la gente, ej: "Entre $15.000 y $25.000 COP". Si viene vacío se arma con el precio.
    private String precioFormateado;

    private String horario;
    private String descripcion;
    private String comoLlegar;
    private String sitioWeb;
    private String instagram;
    private String imagen;
    private Boolean mayorDeEdad;
    private Boolean esEvento;
    private Double latitud;
    private Double longitud;
}
