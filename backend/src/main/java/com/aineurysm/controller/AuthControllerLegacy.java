package com.aineurysm.controller;

import com.aineurysm.dto.AuthResponse;
import com.aineurysm.dto.LoginRequest;
import com.aineurysm.dto.RegisterRequest;
import com.aineurysm.dto.UserResponse;
import com.aineurysm.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173", "http://localhost:3000", "http://localhost:4173", "https://01343946-e828-42d0-b28e-4199593fb280.lovableproject.com"})
public class AuthControllerLegacy {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            System.out.println("=== REGISTER REQUEST (LEGACY) ===");
            System.out.println("Name: " + request.getName());
            System.out.println("Email: " + request.getEmail());
            System.out.println("Role: " + request.getRole());
            
            AuthResponse response = authService.register(request);
            System.out.println("Registration successful for: " + request.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("Registration failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            System.out.println("=== LOGIN REQUEST (LEGACY) ===");
            System.out.println("Email: " + request.getEmail());
            
            AuthResponse response = authService.login(request);
            System.out.println("Login successful for: " + request.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(false, e.getMessage()));
        }
    }

    // Clases internas para respuestas
    public static class ErrorResponse {
        private boolean success;
        private String message;

        public ErrorResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}