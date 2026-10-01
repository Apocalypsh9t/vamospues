package com.example.VamosPues.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {

    // Identificador legible derivado del nombre, ej: "vida_nocturna"
    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 20)
    private String icono;

    @Column(length = 20)
    private String color;

    private Integer orden;
}
