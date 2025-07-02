package com.aineurysm.service;

import com.aineurysm.model.Patient;
import com.aineurysm.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Optional<Patient> getPatientByEmail(String email) {
        return patientRepository.findByEmail(email);
    }

    public List<Patient> searchPatients(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllPatients();
        }
        return patientRepository.findByNameOrEmailContaining(searchTerm);
    }

    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public Patient updatePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    public Long countActivePatients() {
        return patientRepository.countActivePatients();
    }

    public Long countPendingAnalyses() {
        return patientRepository.countPendingAnalyses();
    }

    public Long countUpcomingAppointments() {
        return patientRepository.countUpcomingAppointments();
    }
}