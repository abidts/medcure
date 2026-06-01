package com.sehat24x7.controller;

import com.sehat24x7.dto.ApiResponse;
import com.sehat24x7.dto.PagedResponse;
import com.sehat24x7.model.Doctor;
import com.sehat24x7.service.DoctorManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors/v2")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DoctorManagementController extends BaseController {

    @Autowired
    private DoctorManagementService doctorManagementService;

    /**
     * Get all doctors with pagination
     * GET /api/doctors/v2?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Doctor>>> getAllDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<Doctor> doctors = doctorManagementService.getAllDoctors(page, size);
        return ok("Doctors retrieved successfully", doctors);
    }

    /**
     * Get doctors by specialization with pagination
     * GET /api/doctors/v2/specialization/{id}?page=0&size=10
     */
    @GetMapping("/specialization/{specializationId}")
    public ResponseEntity<ApiResponse<PagedResponse<Doctor>>> getDoctorsBySpecialization(
            @PathVariable Long specializationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<Doctor> doctors = doctorManagementService.getDoctorsBySpecialization(specializationId, page, size);
        return ok("Doctors retrieved by specialization", doctors);
    }

    /**
     * Get doctor by ID
     * GET /api/doctors/v2/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Doctor>> getDoctorById(@PathVariable Long id) {
        Doctor doctor = doctorManagementService.getDoctorById(id);
        return ok(doctor);
    }

    /**
     * Search doctors by name
     * GET /api/doctors/v2/search?name=John
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Doctor>>> searchDoctors(@RequestParam String name) {
        List<Doctor> doctors = doctorManagementService.searchDoctors(name);
        return ok("Search results", doctors);
    }

    /**
     * Get online doctors with pagination
     * GET /api/doctors/v2/online?page=0&size=10
     */
    @GetMapping("/online")
    public ResponseEntity<ApiResponse<PagedResponse<Doctor>>> getOnlineDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<Doctor> doctors = doctorManagementService.getOnlineDoctors(page, size);
        return ok("Online doctors retrieved", doctors);
    }

    /**
     * Get top-rated doctors
     * GET /api/doctors/v2/top-rated?limit=5
     */
    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<Doctor>>> getTopRatedDoctors(
            @RequestParam(defaultValue = "5") int limit) {
        List<Doctor> doctors = doctorManagementService.getTopRatedDoctors(limit);
        return ok("Top-rated doctors retrieved", doctors);
    }

    /**
     * Get available doctors for consultation
     * GET /api/doctors/v2/available
     */
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<Doctor>>> getAvailableDoctors() {
        List<Doctor> doctors = doctorManagementService.getAvailableDoctors();
        return ok("Available doctors retrieved", doctors);
    }
}
