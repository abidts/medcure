package com.sehat24x7.controller;

import com.sehat24x7.model.Doctor;
import com.sehat24x7.model.Staff;
import com.sehat24x7.repository.DoctorRepository;
import com.sehat24x7.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private com.sehat24x7.repository.StaffRepository staffRepository;

    @GetMapping("/doctor/{doctorId}")
    public List<Staff> getStaffByDoctorId(@PathVariable Long doctorId) {
        return staffService.getStaffByDoctorId(doctorId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {
        return staffService.getStaffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createStaff(@RequestBody Map<String, Object> staffData) {
        try {
            // Extract doctorId from request (can be in doctor object or as separate field)
            Long doctorId = null;
            
            // Try to get doctorId from nested doctor object
            if (staffData.containsKey("doctor")) {
                Object doctorObj = staffData.get("doctor");
                if (doctorObj instanceof Map) {
                    Map<String, Object> doctorMap = (Map<String, Object>) doctorObj;
                    Object idObj = doctorMap.get("id");
                    if (idObj instanceof Number) {
                        doctorId = ((Number) idObj).longValue();
                    } else if (idObj instanceof String) {
                        doctorId = Long.parseLong((String) idObj);
                    }
                }
            }
            
            // Also check for direct doctorId field (fallback)
            if (doctorId == null && staffData.containsKey("doctorId")) {
                Object idObj = staffData.get("doctorId");
                if (idObj instanceof Number) {
                    doctorId = ((Number) idObj).longValue();
                } else if (idObj instanceof String) {
                    doctorId = Long.parseLong((String) idObj);
                }
            }

            if (doctorId == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Doctor ID is required");
                return ResponseEntity.badRequest().body(error);
            }

            // Verify doctor exists - use final variable for lambda
            final Long finalDoctorId = doctorId;
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + finalDoctorId));

            // Create staff object
            Staff staff = new Staff();
            staff.setUsername((String) staffData.get("username"));
            String password = (String) staffData.get("password");
            // Only add HASH_ prefix if not already present
            if (!password.startsWith("HASH_")) {
                password = "HASH_" + password;
            }
            staff.setPassword(password);
            staff.setName((String) staffData.get("name"));
            staff.setEmail((String) staffData.get("email"));
            staff.setPhone((String) staffData.get("phone"));
            staff.setDoctor(doctor);

            // Set permissions with defaults
            staff.setCanPrintReceipts(getBooleanValue(staffData.get("canPrintReceipts")));
            staff.setCanPrintPrescriptions(getBooleanValue(staffData.get("canPrintPrescriptions")));
            staff.setCanCreateLetterheads(getBooleanValue(staffData.get("canCreateLetterheads")));
            staff.setIsActive(true);

            String usernameToCheck = staff.getUsername();
            if (staffService.existsByUsername(usernameToCheck)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(error);
            }

            Staff createdStaff = staffRepository.save(staff);
            return ResponseEntity.ok(createdStaff);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    private boolean getBooleanValue(Object value) {
        if (value instanceof Boolean) {
            return (Boolean) value;
        }
        return true; // default value
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable Long id, @RequestBody Staff staff) {
        try {
            return ResponseEntity.ok(staffService.updateStaff(id, staff));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        return staffService.authenticate(username, password)
                .map(staff -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("staff", staff);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid credentials")));
    }
}
