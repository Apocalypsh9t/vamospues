package com.example.VamosPues.service;

import com.example.VamosPues.dto.CategoriaRequestDTO;
import com.example.VamosPues.exception.ConflictoException;
import com.example.VamosPues.model.Categoria;
import com.example.VamosPues.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAllByOrderByOrdenAsc();
    }

    @Transactional
    public Categoria crear(CategoriaRequestDTO dto) {
        String nombre = dto.getNombre().trim();
        String id = nombre.toLowerCase().replaceAll("\\s+", "_");
        if (categoriaRepository.existsById(id)) {
            throw new ConflictoException("Esta categoría ya existe.");
        }
        Categoria categoria = new Categoria(
                id,
                nombre,
                (dto.getIcono() == null || dto.getIcono().isBlank()) ? "📍" : dto.getIcono(),
                (dto.getColor() == null || dto.getColor().isBlank()) ? "#FE8616" : dto.getColor(),
                (int) categoriaRepository.count() + 1);
        return categoriaRepository.save(categoria);
    }
}
