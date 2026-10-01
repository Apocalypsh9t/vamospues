package com.example.VamosPues.service;

import com.example.VamosPues.exception.ClaveInvalidaException;
import com.example.VamosPues.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Service
public class AdminService {

    private final JwtService jwtService;
    private final String claveAdmin;

    public AdminService(JwtService jwtService, @Value("${admin.clave}") String claveAdmin) {
        this.jwtService = jwtService;
        this.claveAdmin = claveAdmin;
    }

    /** Valida la clave del panel y devuelve un token JWT con rol ADMIN. */
    public String iniciarSesion(String clave) {
        boolean correcta = MessageDigest.isEqual(
                clave.getBytes(StandardCharsets.UTF_8),
                claveAdmin.getBytes(StandardCharsets.UTF_8));
        if (!correcta) {
            throw new ClaveInvalidaException("Clave de acceso incorrecta.");
        }
        return jwtService.generarTokenAdmin();
    }
}
