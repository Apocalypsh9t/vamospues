package com.example.VamosPues.controller;

import com.example.VamosPues.dto.LoginRequestDTO;
import com.example.VamosPues.dto.LoginResponseDTO;
import com.example.VamosPues.dto.MensajeDTO;
import com.example.VamosPues.dto.RespaldoDTO;
import com.example.VamosPues.service.AdminService;
import com.example.VamosPues.service.RespaldoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final RespaldoService respaldoService;

    public AdminController(AdminService adminService, RespaldoService respaldoService) {
        this.adminService = adminService;
        this.respaldoService = respaldoService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(new LoginResponseDTO(adminService.iniciarSesion(dto.getClave())));
    }

    @GetMapping("/respaldo")
    public ResponseEntity<RespaldoDTO> exportar() {
        return ResponseEntity.ok(respaldoService.exportar());
    }

    @PostMapping("/respaldo")
    public ResponseEntity<MensajeDTO> importar(@RequestBody RespaldoDTO respaldo) {
        respaldoService.importar(respaldo);
        return ResponseEntity.ok(new MensajeDTO("Base de datos importada"));
    }

    @PostMapping("/restablecer")
    public ResponseEntity<MensajeDTO> restablecer() {
        respaldoService.restablecer();
        return ResponseEntity.ok(new MensajeDTO("Base de datos restablecida a los valores oficiales"));
    }
}
