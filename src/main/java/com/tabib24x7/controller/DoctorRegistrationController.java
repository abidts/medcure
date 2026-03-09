package com.tabib24x7.controller;

import com.tabib24x7.model.Doctor;
import com.tabib24x7.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = "*")
public class DoctorRegistrationController {

    @Autowired
    private DoctorService doctorService;

    /**
     * Doctor self-registration endpoint
     * Creates both user account and doctor profile
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerDoctor(@RequestBody DoctorRegistrationRequest request) {
        try {
            Doctor doctor = new Doctor();
            doctor.setName(request.getName());
            doctor.setEmail(request.getEmail());
            doctor.setPhone(request.getPhone());
            doctor.setQualification(request.getQualification());
            doctor.setExperience(request.getExperience());
            doctor.setYearsOfExperience(request.getYearsOfExperience());
            doctor.setClinicAddress(request.getClinicAddress());
            doctor.setConsultationFee(request.getConsultationFee());
            doctor.setAvailable(true);
            doctor.setJoiningDate(LocalDate.now());
            doctor.setImage(request.getImage());

            // Set specialization if provided
            if (request.getSpecializationId() != null) {
                com.tabib24x7.model.Specialization specialization = new com.tabib24x7.model.Specialization();
                specialization.setId(request.getSpecializationId());
                doctor.setSpecialization(specialization);
            }

            Doctor registeredDoctor = doctorService.registerDoctorWithUser(doctor, request.getPassword());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Doctor registered successfully");
            response.put("doctor", registeredDoctor);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    static class DoctorRegistrationRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
        private String qualification;
        private String experience;
        private Integer yearsOfExperience;
        private Long specializationId;
        private String clinicAddress;
        private Double consultationFee;
        private String image;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getQualification() { return qualification; }
        public void setQualification(String qualification) { this.qualification = qualification; }
        public String getExperience() { return experience; }
        public void setExperience(String experience) { this.experience = experience; }
        public Integer getYearsOfExperience() { return yearsOfExperience; }
        public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
        public Long getSpecializationId() { return specializationId; }
        public void setSpecializationId(Long specializationId) { this.specializationId = specializationId; }
        public String getClinicAddress() { return clinicAddress; }
        public void setClinicAddress(String clinicAddress) { this.clinicAddress = clinicAddress; }
        public Double getConsultationFee() { return consultationFee; }
        public void setConsultationFee(Double consultationFee) { this.consultationFee = consultationFee; }
        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
    }
}
