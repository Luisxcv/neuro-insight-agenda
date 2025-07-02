package com.aineurysm.dto;

import com.aineurysm.model.User;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private Boolean isApproved;
    private Boolean isActive;
    private String createdAt;
    private String phone;
    private String specialty;

    // Constructores
    public UserResponse() {}

    public UserResponse(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole() != null ? user.getRole().toLowerCase() : "patient";
        this.isApproved = user.getIsApproved();
        this.isActive = user.getIsActive();
        this.createdAt = user.getCreatedAt() != null ? user.getCreatedAt().toString() : null;
        this.phone = user.getPhone();
        // Specialty se puede agregar más tarde cuando exista el campo en User
        this.specialty = null;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getIsApproved() { return isApproved; }
    public void setIsApproved(Boolean isApproved) { this.isApproved = isApproved; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
}