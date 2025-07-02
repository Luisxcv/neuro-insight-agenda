package com.aineurysm.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AppointmentRequest {
    private String date;
    private String time;
    private String doctorName;
    private String doctorSpecialty;
    private String patientName;
    private String patientEmail;
}