package com.aineurysm.controller;

import com.aineurysm.dto.UserResponse;
import com.aineurysm.model.User;
import com.aineurysm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${app.frontend-url}")
public class UserController {

    @Autowired
    private UserService userService;

    // Obtener todos los usuarios (solo ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Obtener usuario por ID (ADMIN o el mismo usuario)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // Obtener médicos pendientes de aprobación (solo ADMIN)
    @GetMapping("/pending-doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getPendingDoctors() {
        List<UserResponse> pendingDoctors = userService.getPendingDoctors();
        return ResponseEntity.ok(pendingDoctors);
    }

    // Aprobar médico (solo ADMIN)
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> approveDoctor(@PathVariable Long id) {
        userService.approveDoctor(id);
        return ResponseEntity.ok("Médico aprobado exitosamente");
    }

    // Activar/Desactivar usuario (solo ADMIN)
    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> toggleUserStatus(@PathVariable Long id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok("Estado del usuario actualizado");
    }

    // Eliminar usuario (solo ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Usuario eliminado exitosamente");
    }

    // Obtener perfil del usuario autenticado
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getCurrentUserProfile() {
        UserResponse user = userService.getCurrentUserProfile();
        return ResponseEntity.ok(user);
    }
}