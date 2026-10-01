package com.example.VamosPues.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoriaRequestDTO {

    @NotBlank(message = "Ingresa el nombre de la categoría.")
    private String nombre;

    private String icono;
    private String color;
}
