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
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.frontend-url}")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            System.out.println("=== LOGIN REQUEST ===");
            System.out.println("Email: " + request.getEmail());
            System.out.println("Password: " + request.getPassword());
            
            AuthResponse response = authService.login(request);
            System.out.println("Login successful for: " + request.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("Login failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(Authentication authentication) {
        try {
            UserResponse userResponse = authService.getCurrentUser(authentication);
            return ResponseEntity.ok(new ApiResponse<>(true, "Token válido", userResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(false, "Token inválido"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(new ApiResponse<>(true, "API funcionando correctamente", null));
    }

    // Clases internas para respuestas
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public ApiResponse(boolean success, String message, T data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }

        // Getters y setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public T getData() { return data; }
        public void setData(T data) { this.data = data; }
    }

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