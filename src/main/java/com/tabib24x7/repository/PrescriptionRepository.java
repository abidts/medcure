package com.tabib24x7.repository;

import com.tabib24x7.model.Appointment;
import com.tabib24x7.model.Doctor;
import com.tabib24x7.model.Patient;
import com.tabib24x7.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatient(Patient patient);
    List<Prescription> findByDoctor(Doctor doctor);
    List<Prescription> findByAppointment(Appointment appointment);
    
    @Query("SELECT p FROM Prescription p WHERE p.patient.id = :patientId ORDER BY p.prescriptionDate DESC")
    List<Prescription> findByPatientId(@Param("patientId") Long patientId);
    
    @Query("SELECT p FROM Prescription p WHERE p.doctor.id = :doctorId ORDER BY p.prescriptionDate DESC")
    List<Prescription> findByDoctorId(@Param("doctorId") Long doctorId);
    
    List<Prescription> findByFollowUpRequiredTrue();
    
    @Query("SELECT p FROM Prescription p WHERE p.followUpDate <= CURRENT_DATE AND p.followUpRequired = true")
    List<Prescription> findPendingFollowUps();
}
