package com.example.VamosPues.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {

    @NotBlank(message = "Introduce la clave de acceso.")
    private String clave;
}
