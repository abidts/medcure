package com.tabib24x7.repository;

import com.tabib24x7.model.Appointment;
import com.tabib24x7.model.Appointment.AppointmentStatus;
import com.tabib24x7.model.Appointment.ConsultationType;
import com.tabib24x7.model.Doctor;
import com.tabib24x7.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByPatientAndStatus(Patient patient, AppointmentStatus status);
    List<Appointment> findByDoctorAndStatus(Doctor doctor, AppointmentStatus status);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByDoctorAndAppointmentDate(Doctor doctor, LocalDate date);

    List<Appointment> findByDoctorAndAppointmentDateAndConsultationType(Doctor doctor, LocalDate date, ConsultationType type);

    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentDate = :date ORDER BY a.appointmentTime")
    List<Appointment> findByDoctorAndDateOrdered(@Param("doctor") Doctor doctor, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentDate > :date ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findUpcomingAppointments(@Param("doctor") Doctor doctor, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentDate BETWEEN :startDate AND :endDate ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findAppointmentsInDateRange(
            @Param("doctor") Doctor doctor,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
