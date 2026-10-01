package com.example.VamosPues.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "lugares")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lugar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String categoria;

    @Column(length = 4000)
    private String descripcion;

    @Column(length = 1000)
    private String direccion;

    @Column(length = 100)
    private String municipio;

    @Column(length = 100)
    private String zona;

    @Column(length = 1000)
    private String horario;

    @Column(nullable = false)
    private Integer precio = 0;

    @Column(length = 500)
    private String precioFormateado;

    @Column(length = 2000)
    private String comoLlegar;

    @Column(length = 300)
    private String sitioWeb;

    @Column(length = 150)
    private String instagram;

    @Column(nullable = false)
    private Boolean mayorDeEdad = false;

    @Column(nullable = false)
    private Boolean esEvento = false;

    private Double latitud;

    private Double longitud;

    @Column(length = 1000)
    private String imagen;

    // Los lugares se listan del más reciente al más antiguo: lo que agrega el admin
    // aparece primero, igual que en la versión anterior de la plataforma.
    private Instant fechaCreacion;
}
