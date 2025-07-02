package com.aineurysm.repository;

import com.aineurysm.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    
    List<Patient> findByStatus(Patient.PatientStatus status);
    
    @Query("SELECT p FROM Patient p WHERE p.name LIKE %?1% OR p.email LIKE %?1%")
    List<Patient> findByNameOrEmailContaining(String searchTerm);
    
    @Query("SELECT COUNT(p) FROM Patient p WHERE p.status = 'ACTIVE'")
    Long countActivePatients();
    
    @Query("SELECT COUNT(p) FROM Patient p WHERE p.lastAnalysisResult = 'PENDING'")
    Long countPendingAnalyses();
    
    @Query("SELECT COUNT(p) FROM Patient p WHERE p.nextAppointment IS NOT NULL")
    Long countUpcomingAppointments();
}