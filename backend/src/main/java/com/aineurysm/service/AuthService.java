
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

        // Generar token
        String token = tokenProvider.generateToken(savedUser.getEmail());

        return new AuthResponse(
            true,
            "Usuario registrado exitosamente",
            new UserResponse(savedUser),
            token
        );
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
        String token = tokenProvider.generateToken(user.getEmail());

        return new AuthResponse(
            true,
            "Inicio de sesión exitoso",
            new UserResponse(user),
            token
        );
    }

    public UserResponse getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return new UserResponse(user);
    }
}
