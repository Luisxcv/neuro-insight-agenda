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

        // Crear nuevo usuario
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : User.Role.PATIENT);
        
        // Auto-aprobar pacientes, médicos requieren aprobación manual
        user.setIsApproved(user.getRole() == User.Role.PATIENT);

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
        if (!user.getIsActive()) {
            throw new RuntimeException("Cuenta desactivada. Contacta al administrador");
        }

        // Verificar aprobación para médicos
        if (user.getRole() == User.Role.DOCTOR && !user.getIsApproved()) {
            throw new RuntimeException("Tu cuenta de médico está pendiente de aprobación");
        }

        // Autenticar
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

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