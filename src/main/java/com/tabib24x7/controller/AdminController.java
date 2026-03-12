package com.tabib24x7.controller;

import com.tabib24x7.model.Admin;
import com.tabib24x7.model.Doctor;
import com.tabib24x7.model.User;
import com.tabib24x7.repository.AdminRepository;
import com.tabib24x7.repository.DoctorRepository;
import com.tabib24x7.repository.UserRepository;
import com.tabib24x7.service.AdminService;
import com.tabib24x7.service.DoctorService;
import com.tabib24x7.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // Get doctor by ID
    @GetMapping("/doctors/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        Optional<Doctor> doctorOpt = doctorService.getDoctorById(id);
        return doctorOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create admin user
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody CreateAdminRequest request) {
        try {
            // Create user
            User user = new User();
            user.setEmail(request.getEmail());
            user.setName(request.getName());
            user.setPhone(request.getPhone());
            user.setPassword("HASH_" + request.getPassword());
            user.setRole(request.isSuperAdmin() ? User.UserRole.SUPER_ADMIN : User.UserRole.ADMIN);
            user.setIsActive(true);
            user.setCreatedAt(java.time.LocalDateTime.now());
            user.setUpdatedAt(java.time.LocalDateTime.now());
            userRepository.save(user);

            // Create admin
            Admin admin = new Admin();
            admin.setUser(user);
            admin.setIsSuperAdmin(request.isSuperAdmin());
            admin.setPermissions(request.getPermissions());
            admin.setCreatedAt(java.time.LocalDateTime.now());
            admin.setUpdatedAt(java.time.LocalDateTime.now());
            adminRepository.save(admin);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin created successfully");
            response.put("admin", admin);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get all admins
    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    // Get super admins only
    @GetMapping("/super-admins")
    public ResponseEntity<List<Admin>> getSuperAdmins() {
        return ResponseEntity.ok(adminService.getSuperAdmins());
    }

    // Get admin by ID
    @GetMapping("/admins/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        Optional<Admin> adminOpt = adminService.getAdminById(id);
        return adminOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update admin
    @PutMapping("/admins/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody Admin admin) {
        try {
            Admin updated = adminService.updateAdmin(id, admin);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Deactivate admin
    @DeleteMapping("/admins/{id}")
    public ResponseEntity<?> deactivateAdmin(@PathVariable Long id) {
        try {
            adminService.deactivateAdmin(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin deactivated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Create doctor (by admin)
    @PostMapping("/create-doctor")
    public ResponseEntity<?> createDoctor(@RequestBody CreateDoctorRequest request) {
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
            doctor.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);
            doctor.setJoiningDate(request.getJoiningDate() != null ? request.getJoiningDate() : LocalDate.now());
            doctor.setImage(request.getImage());

            // Set specialization if provided
            if (request.getSpecializationId() != null) {
                com.tabib24x7.model.Specialization specialization = new com.tabib24x7.model.Specialization();
                specialization.setId(request.getSpecializationId());
                doctor.setSpecialization(specialization);
            }

            Doctor createdDoctor = doctorService.createDoctor(doctor);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Doctor created successfully");
            response.put("doctor", createdDoctor);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get all doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // Update doctor
    @PutMapping("/doctors/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        try {
            Doctor updated = doctorService.updateDoctor(id, doctor);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete doctor
    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        try {
            doctorService.deleteDoctor(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Doctor deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // Delete user (with proper handling of foreign key constraints)
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Check if user is a doctor - delete doctor first
                if (user.getRole() == User.UserRole.DOCTOR) {
                    doctorRepository.findByUserId(user.getId()).ifPresent(doctor -> {
                        doctorRepository.delete(doctor);
                    });
                }
                
                // Check if user is an admin - delete admin first
                if (user.getRole() == User.UserRole.ADMIN || user.getRole() == User.UserRole.SUPER_ADMIN) {
                    adminRepository.findByUserId(user.getId()).ifPresent(admin -> {
                        adminRepository.delete(admin);
                    });
                }
                
                // Now delete the user
                userRepository.delete(user);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "User deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Cannot delete user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get dashboard statistics for admin
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalAdmins", adminRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("activeDoctors", doctorRepository.findByAvailableTrue().size());
        stats.put("superAdmins", adminService.getSuperAdmins().size());

        return ResponseEntity.ok(stats);
    }

    // Check if user is super admin
    @GetMapping("/check-super-admin/{adminId}")
    public ResponseEntity<Map<String, Object>> checkSuperAdmin(@PathVariable Long adminId) {
        Map<String, Object> response = new HashMap<>();
        response.put("isSuperAdmin", adminService.isSuperAdmin(adminId));
        return ResponseEntity.ok(response);
    }

    static class CreateAdminRequest {
        private String email;
        private String password;
        private String name;
        private String phone;
        private boolean isSuperAdmin;
        private String permissions;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public boolean isSuperAdmin() { return isSuperAdmin; }
        public void setSuperAdmin(boolean superAdmin) { isSuperAdmin = superAdmin; }
        public String getPermissions() { return permissions; }
        public void setPermissions(String permissions) { this.permissions = permissions; }
    }

    static class CreateDoctorRequest {
        private String name;
        private String email;
        private String phone;
        private String qualification;
        private String experience;
        private Integer yearsOfExperience;
        private Long specializationId;
        private String clinicAddress;
        private Double consultationFee;
        private Boolean available;
        private String image;
        private LocalDate joiningDate;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
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
        public Boolean getAvailable() { return available; }
        public void setAvailable(Boolean available) { this.available = available; }
        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
        public LocalDate getJoiningDate() { return joiningDate; }
        public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }
    }
}
