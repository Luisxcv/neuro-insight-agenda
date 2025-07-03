package com.aineurysm.service;

import com.aineurysm.model.Appointment;
import com.aineurysm.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAppointmentsByPatientEmail(String patientEmail) {
        return appointmentRepository.findByPatientEmailOrderByDateDesc(patientEmail);
    }

    public List<Appointment> getAppointmentsByDoctor(String doctorName) {
        return appointmentRepository.findByDoctorName(doctorName);
    }

    public Appointment createAppointment(Appointment appointment) {
        // Verificar si ya existe una cita en esa fecha y hora con ese doctor
        List<Appointment> existingAppointments = appointmentRepository.findByDateAndTimeAndDoctor(
            appointment.getDate(), 
            appointment.getTime(), 
            appointment.getDoctorName()
        );
        
        if (!existingAppointments.isEmpty()) {
            throw new RuntimeException("Ya existe una cita programada para esa fecha y hora con ese doctor");
        }

        appointment.setStatus(Appointment.AppointmentStatus.pending);
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public boolean isTimeSlotAvailable(LocalDate date, LocalTime time, String doctorName) {
        List<Appointment> existingAppointments = appointmentRepository.findByDateAndTimeAndDoctor(date, time, doctorName);
        return existingAppointments.isEmpty();
    }

    public List<Appointment> getAppointmentsByStatus(Appointment.AppointmentStatus status) {
        return appointmentRepository.findByStatus(status);
    }
}