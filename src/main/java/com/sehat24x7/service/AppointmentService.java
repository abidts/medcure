package com.sehat24x7.service;

import com.sehat24x7.model.Appointment;
import com.sehat24x7.model.Appointment.AppointmentStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentService {
    List<Appointment> getAllAppointments();
    Optional<Appointment> getAppointmentById(Long id);
    List<Appointment> getAppointmentsByPatientId(Long patientId);
    List<Appointment> getAppointmentsByDoctorId(Long doctorId);
    List<Appointment> getAppointmentsByStatus(AppointmentStatus status);
    List<Appointment> getAppointmentsByDate(LocalDate date);
    Appointment createAppointment(Appointment appointment);
    Appointment updateAppointmentStatus(Long id, AppointmentStatus status);
    Appointment updateAppointment(Long id, Appointment appointment);
    void deleteAppointment(Long id);
    void cancelAppointment(Long id);
    void confirmAppointment(Long id);
}
