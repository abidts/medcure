package com.tabib24x7.controller;

import com.tabib24x7.model.Staff;
import com.tabib24x7.service.StaffService;
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
    public ResponseEntity<?> createStaff(@RequestBody Staff staff) {
        try {
            if (staffService.existsByUsername(staff.getUsername())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(error);
            }
            Staff createdStaff = staffService.createStaff(staff);
            return ResponseEntity.ok(createdStaff);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
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
