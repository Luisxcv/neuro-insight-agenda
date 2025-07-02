package com.aineurysm.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(name = "last_visit")
    private LocalDateTime lastVisit;

    @Column(name = "next_appointment")
    private LocalDateTime nextAppointment;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PatientStatus status;

    @Column(name = "total_analyses")
    private Integer totalAnalyses = 0;

    @Column(name = "last_analysis_result")
    @Enumerated(EnumType.STRING)
    private AnalysisResult lastAnalysisResult;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PatientStatus {
        ACTIVE, INACTIVE
    }

    public enum AnalysisResult {
        NORMAL, ABNORMAL, PENDING
    }
}