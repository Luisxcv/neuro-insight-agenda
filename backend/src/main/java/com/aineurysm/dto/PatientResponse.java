package com.aineurysm.dto;

import com.aineurysm.model.Patient;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PatientResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String lastVisit;
    private String nextAppointment;
    private String status;
    private Integer totalAnalyses;
    private String lastAnalysisResult;

    public PatientResponse(Patient patient) {
        this.id = patient.getId();
        this.name = patient.getName();
        this.email = patient.getEmail();
        this.phone = patient.getPhone();
        this.lastVisit = patient.getLastVisit() != null ? patient.getLastVisit().toString() : null;
        this.nextAppointment = patient.getNextAppointment() != null ? patient.getNextAppointment().toString() : null;
        this.status = patient.getStatus().name().toLowerCase();
        this.totalAnalyses = patient.getTotalAnalyses();
        this.lastAnalysisResult = patient.getLastAnalysisResult() != null ? 
            patient.getLastAnalysisResult().name().toLowerCase() : null;
    }
}