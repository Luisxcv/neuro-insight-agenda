package com.aineurysm.controller;

import com.aineurysm.dto.AppointmentRequest;
import com.aineurysm.dto.AppointmentResponse;
import com.aineurysm.model.Appointment;
import com.aineurysm.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:8080")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllAppointments() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = auth.getName();

            List<Appointment> appointments = appointmentService.getAppointmentsByPatientEmail(userEmail);
            
            List<AppointmentResponse> appointmentResponses = appointments.stream()
                .map(AppointmentResponse::new)
                .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", appointmentResponses);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener citas: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/doctor/{doctorName}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAppointmentsByDoctor(@PathVariable String doctorName) {
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByDoctor(doctorName);
            
            List<AppointmentResponse> appointmentResponses = appointments.stream()
                .map(AppointmentResponse::new)
                .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", appointmentResponses);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener citas del doctor: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createAppointment(@RequestBody AppointmentRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = auth.getName();

            System.out.println("=== CREATE APPOINTMENT REQUEST ===");
            System.out.println("Date: " + request.getDate());
            System.out.println("Time: " + request.getTime());
            System.out.println("Doctor: " + request.getDoctorName());
            System.out.println("Patient Email: " + userEmail);

            Appointment appointment = new Appointment();
            appointment.setDate(LocalDate.parse(request.getDate()));
            appointment.setTime(LocalTime.parse(request.getTime()));
            appointment.setDoctorName(request.getDoctorName());
            appointment.setDoctorSpecialty(request.getDoctorSpecialty());
            appointment.setPatientName(request.getPatientName());
            appointment.setPatientEmail(userEmail);
            
            System.out.println("Setting status to: " + Appointment.AppointmentStatus.pending);
            appointment.setStatus(Appointment.AppointmentStatus.pending);

            System.out.println("About to save appointment...");
            Appointment savedAppointment = appointmentService.createAppointment(appointment);
            System.out.println("Appointment saved successfully with ID: " + savedAppointment.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", new AppointmentResponse(savedAppointment));
            response.put("message", "Cita agendada exitosamente");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelAppointment(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

            appointment.setStatus(Appointment.AppointmentStatus.cancelled);
            appointmentService.updateAppointment(appointment);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cita cancelada exitosamente");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPendingAppointments() {
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByStatus(Appointment.AppointmentStatus.pending);
            
            List<AppointmentResponse> appointmentResponses = appointments.stream()
                .map(AppointmentResponse::new)
                .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", appointmentResponses);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener citas pendientes: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> approveAppointment(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

            appointment.setStatus(Appointment.AppointmentStatus.approved);
            appointmentService.updateAppointment(appointment);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cita aprobada exitosamente");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> rejectAppointment(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

            appointment.setStatus(Appointment.AppointmentStatus.rejected);
            appointmentService.updateAppointment(appointment);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cita rechazada");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    }

    @PutMapping("/{id}/request-reschedule")
    public ResponseEntity<Map<String, Object>> requestReschedule(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

            appointment.setStatus(Appointment.AppointmentStatus.reschedule_requested);
            appointmentService.updateAppointment(appointment);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Solicitud de reprogramación enviada");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/reschedule-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getRescheduleRequests() {
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByStatus(Appointment.AppointmentStatus.reschedule_requested);
            
            List<AppointmentResponse> appointmentResponses = appointments.stream()
                .map(AppointmentResponse::new)
                .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", appointmentResponses);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener solicitudes de reprogramación: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }