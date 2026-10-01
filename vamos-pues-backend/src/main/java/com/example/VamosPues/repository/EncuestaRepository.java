package com.example.VamosPues.repository;

import com.example.VamosPues.model.Encuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EncuestaRepository extends JpaRepository<Encuesta, Long> {

    List<Encuesta> findAllByOrderByFechaCreacionDesc();
}
