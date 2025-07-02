package com.aineurysm.repository;

import com.aineurysm.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientEmail(String patientEmail);
    
    List<Appointment> findByDoctorName(String doctorName);
    
    List<Appointment> findByStatus(Appointment.AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.date = ?1 AND a.time = ?2 AND a.doctorName = ?3")
    List<Appointment> findByDateAndTimeAndDoctor(LocalDate date, LocalTime time, String doctorName);
    
    @Query("SELECT a FROM Appointment a WHERE a.patientEmail = ?1 ORDER BY a.date DESC, a.time DESC")
    List<Appointment> findByPatientEmailOrderByDateDesc(String patientEmail);
}