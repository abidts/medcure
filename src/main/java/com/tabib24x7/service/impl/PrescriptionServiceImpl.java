package com.tabib24x7.service.impl;

import com.tabib24x7.model.*;
import com.tabib24x7.repository.*;
import com.tabib24x7.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PrescriptionMedicineRepository medicineRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public Prescription createPrescription(Prescription prescription) {
        if (prescription.getPatient() != null && prescription.getPatient().getId() != null) {
            Patient patient = patientRepository.findById(prescription.getPatient().getId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            prescription.setPatient(patient);
        }
        if (prescription.getDoctor() != null && prescription.getDoctor().getId() != null) {
            Doctor doctor = doctorRepository.findById(prescription.getDoctor().getId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            prescription.setDoctor(doctor);
        }
        if (prescription.getAppointment() != null && prescription.getAppointment().getId() != null) {
            Appointment appointment = appointmentRepository.findById(prescription.getAppointment().getId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            prescription.setAppointment(appointment);
        }

        // Calculate follow-up date if follow-up days specified
        if (prescription.getFollowUpDays() != null && prescription.getFollowUpDays() > 0) {
            prescription.setFollowUpRequired(true);
            prescription.setFollowUpDate(LocalDate.now().plusDays(prescription.getFollowUpDays()));
        }

        return prescriptionRepository.save(prescription);
    }

    @Override
    public Prescription updatePrescription(Long id, Prescription prescription) {
        if (prescriptionRepository.existsById(id)) {
            prescription.setId(id);
            return prescriptionRepository.save(prescription);
        }
        throw new RuntimeException("Prescription not found with id: " + id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Prescription> getPrescriptionsByPatientId(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Prescription> getPrescriptionsByDoctorId(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Prescription> getPrescriptionsByAppointmentId(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return prescriptionRepository.findByAppointment(appointment);
    }

    @Override
    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }

    @Override
    public PrescriptionMedicine addMedicineToPrescription(Long prescriptionId, PrescriptionMedicine medicine) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        medicine.setPrescription(prescription);
        return medicineRepository.save(medicine);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionMedicine> getMedicinesByPrescriptionId(Long prescriptionId) {
        return medicineRepository.findByPrescriptionId(prescriptionId);
    }

    @Override
    public void deleteMedicineFromPrescription(Long medicineId) {
        medicineRepository.deleteById(medicineId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Prescription> getPrescriptionsRequiringFollowUp() {
        return prescriptionRepository.findByFollowUpRequiredTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Prescription> getPendingFollowUps() {
        return prescriptionRepository.findPendingFollowUps();
    }
}
