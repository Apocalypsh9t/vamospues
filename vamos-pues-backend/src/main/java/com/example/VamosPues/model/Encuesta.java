package com.example.VamosPues.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "encuestas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Encuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean encontroFacil = false;

    private Boolean volveriaAUsar = false;

    @Column(length = 2000)
    private String sugerencia;

    private Instant fechaCreacion;
}
