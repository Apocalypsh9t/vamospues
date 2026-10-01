package com.example.VamosPues.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "sugerencias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sugerencia {

    public static final String PENDIENTE = "pendiente";
    public static final String APROBADA = "aprobada";
    public static final String RECHAZADA = "rechazada";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String nombre;

    @Column(length = 100)
    private String categoria;

    @Column(length = 4000)
    private String descripcion;

    @Column(length = 1000)
    private String direccion;

    @Column(length = 100)
    private String municipio;

    @Column(length = 1000)
    private String horario;

    private Integer precio = 0;

    @Column(length = 2000)
    private String comoLlegar;

    @Column(length = 300)
    private String sitioWeb;

    @Column(length = 150)
    private String instagram;

    @Column(length = 2000)
    private String informacionAdicional;

    private Boolean mayorDeEdad = false;

    @Column(length = 1000)
    private String imagen;

    @Column(nullable = false, length = 20)
    private String estado = PENDIENTE;

    // Id del lugar publicado cuando el admin aprueba la sugerencia
    private Long lugarCreadoId;

    private Instant fechaCreacion;
}
