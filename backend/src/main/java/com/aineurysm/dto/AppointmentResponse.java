package com.aineurysm.dto;

import com.aineurysm.model.Appointment;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AppointmentResponse {
    private Long id;
    private String date;
    private String time;
    private String doctor;
    private String specialty;
    private String patientName;
    private String patientEmail;
    private String status;
    private String createdAt;

    public AppointmentResponse(Appointment appointment) {
        this.id = appointment.getId();
        this.date = appointment.getDate().toString();
        this.time = appointment.getTime().toString();
        this.doctor = appointment.getDoctorName();
        this.specialty = appointment.getDoctorSpecialty();
        this.patientName = appointment.getPatientName();
        this.patientEmail = appointment.getPatientEmail();
        this.status = appointment.getStatus().name().toLowerCase();
        this.createdAt = appointment.getCreatedAt().toString();
    }
}