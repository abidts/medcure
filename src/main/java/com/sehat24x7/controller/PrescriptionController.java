package com.sehat24x7.controller;

import com.sehat24x7.model.Appointment;
import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.Patient;
import com.sehat24x7.model.Prescription;
import com.sehat24x7.model.PrescriptionMedicine;
import com.sehat24x7.repository.PrescriptionMedicineRepository;
import com.sehat24x7.service.AppointmentService;
import com.sehat24x7.service.DoctorService;
import com.sehat24x7.service.PatientService;
import com.sehat24x7.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PrescriptionMedicineRepository medicineRepository;

    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        return prescriptionService.getPrescriptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<Prescription> getPrescriptionsByPatient(@PathVariable Long patientId) {
        return prescriptionService.getPrescriptionsByPatientId(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Prescription> getPrescriptionsByDoctor(@PathVariable Long doctorId) {
        return prescriptionService.getPrescriptionsByDoctorId(doctorId);
    }

    @GetMapping("/appointment/{appointmentId}")
    public List<Prescription> getPrescriptionsByAppointment(@PathVariable Long appointmentId) {
        return prescriptionService.getPrescriptionsByAppointmentId(appointmentId);
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody PrescriptionRequest request) {
        try {
            Prescription prescription = new Prescription();

            // Set patient
            if (request.getPatientId() != null) {
                Patient patient = patientService.getPatientById(request.getPatientId())
                        .orElseThrow(() -> new RuntimeException("Patient not found"));
                prescription.setPatient(patient);
            }

            // Set doctor
            if (request.getDoctorId() != null) {
                Doctor doctor = doctorService.getDoctorById(request.getDoctorId())
                        .orElseThrow(() -> new RuntimeException("Doctor not found"));
                prescription.setDoctor(doctor);
            }

            // Set appointment
            if (request.getAppointmentId() != null) {
                Appointment appointment = appointmentService.getAppointmentById(request.getAppointmentId())
                        .orElseThrow(() -> new RuntimeException("Appointment not found"));
                prescription.setAppointment(appointment);
            }

            prescription.setDiagnosis(request.getDiagnosis());
            prescription.setSymptoms(request.getSymptoms());
            prescription.setGeneralAdvice(request.getGeneralAdvice());
            prescription.setDietaryAdvice(request.getDietaryAdvice());
            prescription.setLifestyleChanges(request.getLifestyleChanges());
            prescription.setFollowUpInstructions(request.getFollowUpInstructions());
            prescription.setFollowUpDays(request.getFollowUpDays());

            Prescription created = prescriptionService.createPrescription(prescription);

            // Add medicines if provided
            if (request.getMedicines() != null && !request.getMedicines().isEmpty()) {
                for (MedicineRequest medRequest : request.getMedicines()) {
                    PrescriptionMedicine medicine = new PrescriptionMedicine();
                    medicine.setPrescription(created);
                    medicine.setMedicineName(medRequest.getMedicineName());
                    medicine.setDosage(medRequest.getDosage());
                    medicine.setFrequency(medRequest.getFrequency());
                    medicine.setDurationDays(medRequest.getDurationDays());
                    medicine.setInstructions(medRequest.getInstructions());
                    medicine.setBeforeFood(medRequest.getBeforeFood());
                    medicineRepository.save(medicine);
                }
            }

            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(
            @PathVariable Long id,
            @RequestBody Prescription prescription) {
        try {
            return ResponseEntity.ok(prescriptionService.updatePrescription(id, prescription));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/follow-ups/pending")
    public List<Prescription> getPendingFollowUps() {
        return prescriptionService.getPendingFollowUps();
    }

    // Request/Response DTOs
    public static class PrescriptionRequest {
        private Long patientId;
        private Long doctorId;
        private Long appointmentId;
        private String diagnosis;
        private String symptoms;
        private String generalAdvice;
        private String dietaryAdvice;
        private String lifestyleChanges;
        private String followUpInstructions;
        private Integer followUpDays;
        private List<MedicineRequest> medicines;

        public Long getPatientId() { return patientId; }
        public void setPatientId(Long patientId) { this.patientId = patientId; }
        public Long getDoctorId() { return doctorId; }
        public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
        public Long getAppointmentId() { return appointmentId; }
        public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
        public String getDiagnosis() { return diagnosis; }
        public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
        public String getSymptoms() { return symptoms; }
        public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
        public String getGeneralAdvice() { return generalAdvice; }
        public void setGeneralAdvice(String generalAdvice) { this.generalAdvice = generalAdvice; }
        public String getDietaryAdvice() { return dietaryAdvice; }
        public void setDietaryAdvice(String dietaryAdvice) { this.dietaryAdvice = dietaryAdvice; }
        public String getLifestyleChanges() { return lifestyleChanges; }
        public void setLifestyleChanges(String lifestyleChanges) { this.lifestyleChanges = lifestyleChanges; }
        public String getFollowUpInstructions() { return followUpInstructions; }
        public void setFollowUpInstructions(String followUpInstructions) { this.followUpInstructions = followUpInstructions; }
        public Integer getFollowUpDays() { return followUpDays; }
        public void setFollowUpDays(Integer followUpDays) { this.followUpDays = followUpDays; }
        public List<MedicineRequest> getMedicines() { return medicines; }
        public void setMedicines(List<MedicineRequest> medicines) { this.medicines = medicines; }
    }

    public static class MedicineRequest {
        private String medicineName;
        private String dosage;
        private String frequency;
        private Integer durationDays;
        private String instructions;
        private Boolean beforeFood = true;

        public String getMedicineName() { return medicineName; }
        public void setMedicineName(String medicineName) { this.medicineName = medicineName; }
        public String getDosage() { return dosage; }
        public void setDosage(String dosage) { this.dosage = dosage; }
        public String getFrequency() { return frequency; }
        public void setFrequency(String frequency) { this.frequency = frequency; }
        public Integer getDurationDays() { return durationDays; }
        public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }
        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }
        public Boolean getBeforeFood() { return beforeFood; }
        public void setBeforeFood(Boolean beforeFood) { this.beforeFood = beforeFood; }
    }
}
