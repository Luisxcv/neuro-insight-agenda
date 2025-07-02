package com.aineurysm.controller;

import com.aineurysm.dto.PatientResponse;
import com.aineurysm.model.Patient;
import com.aineurysm.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:8080")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllPatients(@RequestParam(required = false) String search) {
        try {
            List<Patient> patients;
            if (search != null && !search.trim().isEmpty()) {
                patients = patientService.searchPatients(search);
            } else {
                patients = patientService.getAllPatients();
            }

            List<PatientResponse> patientResponses = patients.stream()
                .map(PatientResponse::new)
                .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", patientResponses);
            response.put("total", patientResponses.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener pacientes: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPatientById(@PathVariable Long id) {
        try {
            Patient patient = patientService.getPatientById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", new PatientResponse(patient));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPatientStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalPatients", patientService.getAllPatients().size());
            stats.put("activePatients", patientService.countActivePatients());
            stats.put("pendingAnalyses", patientService.countPendingAnalyses());
            stats.put("upcomingAppointments", patientService.countUpcomingAppointments());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stats);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener estadísticas: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createPatient(@RequestBody Patient patient) {
        try {
            Patient savedPatient = patientService.createPatient(patient);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", new PatientResponse(savedPatient));
            response.put("message", "Paciente creado exitosamente");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al crear paciente: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}