
package com.aineurysm.service;

import com.aineurysm.dto.AuthResponse;
import com.aineurysm.dto.LoginRequest;
import com.aineurysm.dto.RegisterRequest;
import com.aineurysm.dto.UserResponse;
import com.aineurysm.model.User;
import com.aineurysm.repository.UserRepository;
import com.aineurysm.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Validar si el usuario ya existe
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ya existe una cuenta con este email");
        }

        // Validar contraseñas coincidan
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Las contraseñas no coinciden");
        }

        // Validar longitud de contraseña
        if (request.getPassword().length() < 6) {
            throw new RuntimeException("La contraseña debe tener al menos 6 caracteres");
        }

        // Crear nuevo usuario
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole().toLowerCase() : "patient");
        
        // Auto-aprobar pacientes, médicos requieren aprobación manual  
        user.setIsApproved("patient".equals(user.getRole()));
        
        // Asegurar que los pacientes tengan el rol correcto por defecto
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("patient");
        }

        User savedUser = userRepository.save(user);
        System.out.println("Usuario guardado exitosamente: " + savedUser.getEmail());

        // Generar token
        System.out.println("Generando token para registro: " + savedUser.getEmail());
        String token = tokenProvider.generateToken(savedUser.getEmail());
        System.out.println("Token generado en registro: " + (token != null ? "SÍ" : "NO"));

        System.out.println("Creando UserResponse para registro...");
        UserResponse userResponse = new UserResponse(savedUser);
        System.out.println("UserResponse creado en registro");

        System.out.println("Creando AuthResponse para registro...");
        AuthResponse authResponse = new AuthResponse(
            true,
            "Usuario registrado exitosamente",
            userResponse,
            token
        );
        System.out.println("AuthResponse creado en registro exitosamente");
        
        return authResponse;
    }

    public AuthResponse login(LoginRequest request) {
        // Buscar usuario
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        // Verificar si está activo
        System.out.println("User isActive: " + user.getIsActive());
        if (!user.getIsActive()) {
            System.out.println("FALLO: Usuario no activo");
            throw new RuntimeException("Cuenta desactivada. Contacta al administrador");
        }

        // Verificar aprobación para médicos
        System.out.println("User role: " + user.getRole());
        System.out.println("User isApproved: " + user.getIsApproved());
        if ("doctor".equals(user.getRole()) && !user.getIsApproved()) {
            System.out.println("FALLO: Doctor no aprobado");
            throw new RuntimeException("Tu cuenta de médico está pendiente de aprobación");
        }

        // Verificar contraseña manualmente primero
        System.out.println("=== DEBUG LOGIN ===");
        System.out.println("Email encontrado: " + user.getEmail());
        System.out.println("Password desde request: " + request.getPassword());
        System.out.println("Password hash en BD: " + user.getPassword());
        System.out.println("Password matches: " + passwordEncoder.matches(request.getPassword(), user.getPassword()));
        System.out.println("==================");
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // Generar token
        System.out.println("Generando token para: " + user.getEmail());
        String token;
        try {
            token = tokenProvider.generateToken(user.getEmail());
            System.out.println("Token generado exitosamente: " + (token != null ? "SÍ" : "NO"));
        } catch (Exception e) {
            System.out.println("ERROR generando token: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error generando token de autenticación");
        }
        
        System.out.println("Creando UserResponse...");
        UserResponse userResponse;
        try {
            userResponse = new UserResponse(user);
            System.out.println("UserResponse creado exitosamente");
        } catch (Exception e) {
            System.out.println("ERROR creando UserResponse: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error creando respuesta de usuario");
        }
        
        System.out.println("Creando AuthResponse...");
        AuthResponse authResponse;
        try {
            authResponse = new AuthResponse(
                true,
                "Inicio de sesión exitoso",
                userResponse,
                token
            );
            System.out.println("AuthResponse creado exitosamente");
        } catch (Exception e) {
            System.out.println("ERROR creando AuthResponse: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error creando respuesta de autenticación");
        }
        
        return authResponse;
    }

    public UserResponse getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return new UserResponse(user);
    }
}
