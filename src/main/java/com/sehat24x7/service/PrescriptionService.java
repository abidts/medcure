package com.sehat24x7.service;

import com.sehat24x7.model.Prescription;
import com.sehat24x7.model.PrescriptionMedicine;

import java.util.List;
import java.util.Optional;

public interface PrescriptionService {
    Prescription createPrescription(Prescription prescription);
    Prescription updatePrescription(Long id, Prescription prescription);
    Optional<Prescription> getPrescriptionById(Long id);
    List<Prescription> getAllPrescriptions();
    List<Prescription> getPrescriptionsByPatientId(Long patientId);
    List<Prescription> getPrescriptionsByDoctorId(Long doctorId);
    List<Prescription> getPrescriptionsByAppointmentId(Long appointmentId);
    void deletePrescription(Long id);
    
    PrescriptionMedicine addMedicineToPrescription(Long prescriptionId, PrescriptionMedicine medicine);
    List<PrescriptionMedicine> getMedicinesByPrescriptionId(Long prescriptionId);
    void deleteMedicineFromPrescription(Long medicineId);
    
    List<Prescription> getPrescriptionsRequiringFollowUp();
    List<Prescription> getPendingFollowUps();
}
