package com.example.VamosPues.exception;

import java.time.LocalDateTime;

public record ErrorDTO(String codigoEstado, String mensaje, LocalDateTime marcaDeTiempo) {
}
