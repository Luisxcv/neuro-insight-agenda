
package com.aineurysm.service;

import com.aineurysm.dto.UserResponse;
import com.aineurysm.model.User;
import com.aineurysm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertToUserResponse(user);
    }

    public List<UserResponse> getPendingDoctors() {
        List<User> pendingDoctors = userRepository.findByRoleAndIsApproved("doctor", false);
        return pendingDoctors.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    public void approveDoctor(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (!"doctor".equals(user.getRole())) {
            throw new RuntimeException("El usuario no es un médico");
        }
        
        user.setApproved(true);
        userRepository.save(user);
    }

    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        userRepository.delete(user);
    }

    public UserResponse getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return convertToUserResponse(user);
    }

    public List<UserResponse> getApprovedDoctors() {
        List<User> approvedDoctors = userRepository.findByRoleAndIsApprovedAndIsActive("doctor", true, true);
        return approvedDoctors.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(user);
    }
}
